import { CanvasRenderer } from './CanvasRenderer';
import { Vector2 } from './Vector2';
import { clamp } from '@/lib/utils';

export interface NeuralFieldPalette {
  /** Node fill, as `r, g, b` so alpha can be composed per node. */
  readonly node: string;
  /** Synapse stroke, same format. */
  readonly link: string;
  /** Accent used for nodes inside the cursor's influence radius. */
  readonly accent: string;
}

export interface NeuralFieldOptions {
  /** Nodes per 100,000 px² of canvas — keeps density constant across sizes. */
  readonly density?: number;
  readonly maxNodes?: number;
  /** Nodes closer than this (CSS px) are linked. */
  readonly linkDistance?: number;
  /** Cursor influence radius in CSS px. */
  readonly pointerRadius?: number;
  readonly speed?: number;
  readonly palette: NeuralFieldPalette;
}

/** One node in the field. Internal to the renderer. */
class Node {
  readonly position: Vector2;
  readonly velocity: Vector2;
  readonly radius: number;
  /** Per-node phase so the twinkle is not synchronised across the field. */
  readonly phase: number;
  /** 0..1 proximity to the cursor, smoothed frame to frame. */
  influence = 0;

  constructor(position: Vector2, velocity: Vector2, radius: number) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.phase = Math.random() * Math.PI * 2;
  }
}

/**
 * The hero's "neural network" field: drifting nodes, synapses drawn between
 * near neighbours, and a cursor that locally brightens and attracts the mesh.
 *
 * Performance notes — this runs at 60fps on a 4K canvas:
 *  - linking is O(n²) but over a *spatially sorted* array, and the inner loop
 *    breaks early once nodes are too far right to ever link (see `#drawLinks`)
 *  - distance comparisons stay squared; no sqrt until a link actually draws
 *  - all vectors are mutated in place, so a frame allocates nothing
 */
export class NeuralField extends CanvasRenderer {
  static readonly #DEFAULTS = {
    density: 9,
    maxNodes: 140,
    linkDistance: 148,
    pointerRadius: 190,
    speed: 0.014,
  } as const;

  #nodes: Node[] = [];
  #palette: NeuralFieldPalette;
  readonly #options: Required<Omit<NeuralFieldOptions, 'palette'>>;

  /** Cursor in CSS px, or null when the pointer has left the canvas. */
  readonly #pointer = new Vector2(-9999, -9999);
  #pointerActive = false;
  /** Eased pointer, so the influence halo trails the cursor smoothly. */
  readonly #pointerEased = new Vector2(-9999, -9999);

  #linkDistanceSquared = 0;
  #pointerRadiusSquared = 0;

  constructor(canvas: HTMLCanvasElement, options: NeuralFieldOptions) {
    super(canvas);
    this.#palette = options.palette;
    this.#options = {
      density: options.density ?? NeuralField.#DEFAULTS.density,
      maxNodes: options.maxNodes ?? NeuralField.#DEFAULTS.maxNodes,
      linkDistance: options.linkDistance ?? NeuralField.#DEFAULTS.linkDistance,
      pointerRadius: options.pointerRadius ?? NeuralField.#DEFAULTS.pointerRadius,
      speed: options.speed ?? NeuralField.#DEFAULTS.speed,
    };
  }

  /** Re-colour without rebuilding the field — used when the theme flips. */
  setPalette(palette: NeuralFieldPalette): void {
    this.#palette = palette;
  }

  /** Feed a pointer position in CSS pixels relative to the canvas. */
  setPointer(x: number, y: number): void {
    this.#pointer.set(x, y);
    if (!this.#pointerActive) {
      // Jump the eased pointer on first entry, otherwise it sweeps in from -9999.
      this.#pointerEased.set(x, y);
      this.#pointerActive = true;
    }
  }

  clearPointer(): void {
    this.#pointerActive = false;
    this.#pointer.set(-9999, -9999);
    this.#pointerEased.set(-9999, -9999);
  }

  protected override onResize(width: number, height: number): void {
    const { density, maxNodes, linkDistance, pointerRadius } = this.#options;

    // Scale the link radius down on small screens so phones do not render a
    // solid web of lines at a fraction of the area.
    const scale = clamp(Math.min(width, height) / 900, 0.6, 1);
    this.#linkDistanceSquared = (linkDistance * scale) ** 2;
    this.#pointerRadiusSquared = (pointerRadius * scale) ** 2;

    const target = clamp(Math.round((width * height) / 100_000) * density, 28, maxNodes);
    this.#rebuild(target, width, height);
  }

  protected override onFrame(deltaMs: number, elapsedMs: number): void {
    // Normalise to 60fps steps so motion is frame-rate independent.
    const step = deltaMs / 16.667;

    this.#easePointer(step);
    this.#updateNodes(step);

    // Nodes drift slowly, so a cheap insertion sort keeps the array ordered by
    // x in effectively O(n) — which is what makes the early break below valid.
    this.#sortByX();

    this.context.clearRect(0, 0, this.width, this.height);
    this.#drawLinks();
    this.#drawNodes(elapsedMs);
  }

  protected override onDispose(): void {
    this.#nodes = [];
  }

  /* ── internals ──────────────────────────────────────────────────────── */

  #rebuild(count: number, width: number, height: number): void {
    const existing = this.#nodes.length;

    if (count < existing) {
      this.#nodes.length = count;
      return;
    }

    const speed = this.#options.speed;
    for (let i = existing; i < count; i += 1) {
      this.#nodes.push(
        new Node(
          new Vector2(Math.random() * width, Math.random() * height),
          Vector2.random(speed * 60),
          0.9 + Math.random() * 1.9,
        ),
      );
    }
  }

  #easePointer(step: number): void {
    if (!this.#pointerActive) return;
    const factor = Math.min(1, 0.12 * step);
    this.#pointerEased.x += (this.#pointer.x - this.#pointerEased.x) * factor;
    this.#pointerEased.y += (this.#pointer.y - this.#pointerEased.y) * factor;
  }

  #updateNodes(step: number): void {
    const { width, height } = this;
    const pointer = this.#pointerEased;
    const pointerActive = this.#pointerActive;
    const radiusSquared = this.#pointerRadiusSquared;

    for (const node of this.#nodes) {
      const { position, velocity } = node;

      position.x += velocity.x * step;
      position.y += velocity.y * step;

      // Wrap rather than bounce: no visible walls, no clustering at edges.
      if (position.x < -20) position.x = width + 20;
      else if (position.x > width + 20) position.x = -20;
      if (position.y < -20) position.y = height + 20;
      else if (position.y > height + 20) position.y = -20;

      if (!pointerActive) {
        node.influence *= 0.9;
        continue;
      }

      const distanceSquared = position.distanceSquaredTo(pointer);
      if (distanceSquared < radiusSquared) {
        const proximity = 1 - distanceSquared / radiusSquared;
        // Ease toward the target so the halo fades rather than snapping.
        node.influence += (proximity - node.influence) * Math.min(1, 0.18 * step);

        // Gentle attraction toward the cursor — the field "leans in".
        const distance = Math.sqrt(distanceSquared) || 1;
        const pull = proximity * proximity * 0.22 * step;
        position.x += ((pointer.x - position.x) / distance) * pull;
        position.y += ((pointer.y - position.y) / distance) * pull;
      } else {
        node.influence *= 0.92;
      }
    }
  }

  /** Insertion sort by x — near-sorted input makes this effectively linear. */
  #sortByX(): void {
    const nodes = this.#nodes;
    for (let i = 1; i < nodes.length; i += 1) {
      const current = nodes[i] as Node;
      let j = i - 1;
      while (j >= 0 && (nodes[j] as Node).position.x > current.position.x) {
        nodes[j + 1] = nodes[j] as Node;
        j -= 1;
      }
      nodes[j + 1] = current;
    }
  }

  #drawLinks(): void {
    const { context } = this;
    const nodes = this.#nodes;
    const maxSquared = this.#linkDistanceSquared;
    const maxDistance = Math.sqrt(maxSquared);
    const { link, accent } = this.#palette;

    context.lineCap = 'round';

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i] as Node;

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j] as Node;

        // Array is x-sorted: once b is beyond reach on x alone, so is every
        // node after it. This is what keeps the quadratic loop cheap.
        if (b.position.x - a.position.x > maxDistance) break;

        const distanceSquared = a.position.distanceSquaredTo(b.position);
        if (distanceSquared > maxSquared) continue;

        const closeness = 1 - distanceSquared / maxSquared;
        const energy = Math.max(a.influence, b.influence);
        const alpha = closeness * (0.16 + energy * 0.55);
        if (alpha < 0.012) continue;

        context.strokeStyle = `rgba(${energy > 0.25 ? accent : link}, ${alpha.toFixed(3)})`;
        context.lineWidth = 0.6 + energy * 1.1;
        context.beginPath();
        context.moveTo(a.position.x, a.position.y);
        context.lineTo(b.position.x, b.position.y);
        context.stroke();
      }
    }
  }

  #drawNodes(elapsedMs: number): void {
    const { context } = this;
    const { node: nodeColour, accent } = this.#palette;
    const time = elapsedMs * 0.001;

    for (const node of this.#nodes) {
      const twinkle = 0.62 + Math.sin(time * 1.4 + node.phase) * 0.22;
      const energy = node.influence;
      const radius = node.radius * (1 + energy * 1.5);
      const alpha = clamp(twinkle * (0.4 + energy * 0.6), 0, 1);

      context.beginPath();
      context.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${energy > 0.25 ? accent : nodeColour}, ${alpha.toFixed(3)})`;
      context.fill();

      // Bloom only where the cursor is — a full-field glow is both expensive
      // and visually muddy.
      if (energy > 0.3) {
        context.beginPath();
        context.arc(node.position.x, node.position.y, radius * 4.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${accent}, ${(energy * 0.07).toFixed(3)})`;
        context.fill();
      }
    }
  }
}
