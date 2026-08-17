type SlideElement = {
	id: string;
};
type Reg = [
	number,
	string
];
interface PosEntry {
	p: string;
	o: string;
	r: Reg;
}
interface TxtTok {
	id: string;
	t: string;
	d?: 1;
}
interface TxtState {
	sd: Reg;
	toks: TxtTok[];
	/** deletes that overtook their token's insert — resolved on arrival */
	pd?: string[];
}
interface SyncStateJSON {
	/** sync format version (SYNC_V) — mismatched saved state is discarded */
	v: number;
	lamport: number;
	vv: Record<string, number>;
	regs: Record<string, Reg>;
	pos: Record<string, PosEntry>;
	births: Record<string, Reg>;
	tombs: Record<string, Reg>;
	/**
	 * Per-character token history for every text node — the structure that lets
	 * two people type into one paragraph without either clobbering the other.
	 *
	 * OPTIONAL, and an app may choose not to stamp it. Measured: identical prose
	 * costs ×0.2 of its own size when it arrives as one write (a paste, an
	 * import, an agent) and ×25.8 when it is TYPED, because a typing run mints a
	 * token per character and a deletion cannot remove one — a tombstone is how
	 * "delete" is expressed to a replica that has not caught up yet, so the
	 * history only ever grows. An emptied paragraph still carries everything ever
	 * typed into it.
	 *
	 * bento/slides stamps it: slide text is titles and bullets. bento/spaces
	 * does NOT — a space is typed prose, which is the whole app, and the state
	 * would outweigh the document many times over inside the plaintext
	 * #bento-doc block, re-serialized on every save and re-parsed on every open.
	 *
	 * ABSENT MEANS BLOCK-LEVEL MERGING, not breakage: `fromJSON` restores a
	 * state with no token history, the differ falls back to a whole-value `set`
	 * for that node's text, and the merge resolves last-writer-wins per block
	 * instead of per character. A LIVE session is unaffected — both replicas hold
	 * the tokens in memory for as long as they are connected; what degrades is
	 * two offline forks reunited later, editing the SAME paragraph.
	 *
	 * Garbage-collecting the tombstones instead (what Yjs does by default) needs
	 * to know every replica has seen the delete. A file that people mail to each
	 * other has no closed set of peers and no moment at which that becomes true —
	 * a copy can come back out of a mailbox a year later — so the causal cutoff
	 * that makes GC safe never arrives here.
	 */
	txt?: Record<string, TxtState>;
	/** values set during a node's dead window — replayed on resurrection.
	 * `r` is the register stamp the value belongs to: replay only while it
	 * is still the current winner (a newer applied set invalidates it). */
	stash: Record<string, Record<string, {
		v?: unknown;
		r: Reg;
	}>>;
	/** live nodes whose winning parent is dead/absent (invisible but kept) */
	limbo: Record<string, SlideElement>;
}
export declare const FORMAT = "bento/slides";
export declare const FORMAT_VERSION = 1;
export type TransitionKind = "none" | "fade" | "slide" | "zoom" | "morph";
export interface ElementBase {
	/** Stable per-slide identity: `data-el-id`, selection, connector/comment
	 *  anchors, and the CRDT node key. Also the DEFAULT morph key — elements
	 *  sharing an id across adjacent slides morph into each other (the
	 *  duplicate-a-slide idiom). Never mutate it to re-pair a morph; set
	 *  `morphId` instead so identity stays stable. */
	id: string;
	/** Optional morph-key override. When set, this element morphs with elements
	 *  whose effective morph key (`morphId ?? id`) matches — letting two
	 *  independently-created elements on different slides be paired without
	 *  touching either's `id`. Omitted = fall back to `id` (the common case).
	 *  Must not collide with another element's effective key on the SAME slide. */
	morphId?: string;
	x: number;
	y: number;
	w: number;
	h: number;
	/** degrees, clockwise */
	rotation: number;
	opacity: number;
	/**
	 * Drop shadow(s), rendered with CSS drop-shadow so they follow the
	 * element's alpha shape (rounded corners, ellipses, glyphs, image
	 * cutouts). An array stacks: e.g. a dark elevation shadow plus a soft
	 * white glow.
	 */
	shadow?: ShadowSpec | ShadowSpec[];
	/** Gaussian blur ON this element, in px. Composed into the SAME CSS `filter`
	 *  as `shadow` (both apply). Survives PDF/print, unlike backdrop blur. */
	blur?: number;
	/** CSS mix-blend-mode for this element ('screen' for neon light glows,
	 *  'multiply'/'overlay' for editorial duotones). Omitted/'' = normal. */
	blend?: string;
	/** Frosted-glass backdrop blur behind this element, in px (0/undefined = off).
	 *  Screen-only: browser print/PDF drops backdrop-filter (pair with a
	 *  translucent `fill` so PDFs show a graceful flat panel). */
	backdropFilter?: number;
	/** presentation effects, run in present mode only */
	fx?: {
		/** entrance animation when the slide is shown. fade-* nudge ~16px; slide-*
		 *  sweep ~120px in from an edge (slide-left starts to the right, etc.) */
		enter?: "fade-up" | "fade" | "fade-down" | "slide-left" | "slide-right" | "slide-up" | "slide-down";
		/** entrance duration in seconds; omitted = the per-kind default
		 *  (slide-* 0.75s, fade-* 0.55s). Lower = snappier, higher = more languid. */
		enterDur?: number;
		/** stagger step within the entrance sequence; equal values enter together */
		order?: number;
		/** animate numeric parts of the text from 0 to their final value */
		countUp?: boolean;
		/** continuous ambient motion (slow zoom, for full-bleed photos) */
		ambient?: "kenburns";
		/**
		 * Ken-burns tuning. dir 'drift' (default) is the endless slow yoyo zoom;
		 * 'out' and 'in' play ONCE per slide entry — 'out' starts zoomed by
		 * `scale` and settles to rest (the classic title-photo effect).
		 * `scale` is the far end of the zoom (e.g. 1.06), `duration` in seconds.
		 */
		ken?: {
			dir?: "drift" | "out" | "in";
			scale?: number;
			duration?: number;
		};
		/** continuous looping animation */
		loop?: {
			type: "dash-march";
			distance?: number;
			duration?: number;
		} | {
			type: "motion-path";
			path: string;
			duration: number;
			delay?: number;
			/** easing over each lap (default 'none' = constant tempo) */
			ease?: string;
			/** per-anchor speed multipliers (1 = normal, <1 dwells, >1 rushes);
			 *  length matches the path's anchor count. Warps the arc-length map
			 *  so the element can linger at some points and rush between others. */
			speeds?: number[];
		};
	};
	/** while presenting, clicking this element jumps to the slide with this id */
	link?: string;
	/** semantic group tag — hover focus and multi-element behaviours target it */
	group?: string;
	/**
	 * Editor grouping: elements sharing a groupId select and move as one
	 * (click any member → whole group; Alt-click digs to the individual).
	 * Distinct from `group`, which carries presentation semantics.
	 */
	groupId?: string;
	/**
	 * In-slide hover reveal: this element is only visible while an element
	 * whose `group` equals this value is hovered (slide.hover type 'reveal').
	 * The slide's hover.default set is shown when nothing is hovered.
	 */
	showOnHover?: string;
	/**
	 * Layout role — what this element IS on the slide ('title', 'subtitle',
	 * 'body', 'kicker'). Applying a different layout moves content between
	 * same-role elements, PowerPoint-placeholder style. Free-form string;
	 * those four are the conventions the built-in layouts use.
	 */
	role?: string;
}
export interface ShadowSpec {
	x?: number;
	y?: number;
	blur: number;
	color: string;
}
export interface TextElement extends ElementBase {
	type: "text";
	/** Rich text as sanitized inline HTML (b/i/u/br/span only). */
	html: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: number;
	color: string;
	/** When set (and stops non-empty), painted into the glyphs; wins over `color`. */
	colorGradient?: GradientFill;
	align: "left" | "center" | "right";
	valign: "top" | "middle" | "bottom";
	lineHeight: number;
	/** px; optional tracking for letter-spaced caps labels */
	letterSpacing?: number;
	/** Outline / hollow glyphs via -webkit-text-stroke. `fill:'none'` makes the
	 *  interior transparent (the classic hollow section-break word); default keeps
	 *  the solid `color` fill and just adds an outline. */
	textStroke?: {
		width: number;
		color: string;
		fill?: string;
	};
	/**
	 * Layout placeholder prompt ("Click to add title"). While the element's
	 * html is empty: the editor shows this dimmed; present and print hide the
	 * element entirely. Cleared content brings the prompt back.
	 */
	placeholder?: string;
}
export type ShapeKind = "rect" | "ellipse" | "triangle" | "arrow" | "line" | "path";
/** Linear gradient fill. Colors are any CSS color, including rgba(). */
export interface GradientFill {
	/** degrees, CSS convention: 0 = bottom→top, 90 = left→right */
	angle: number;
	/** ordered stops; `at` is 0..1 along the gradient line */
	stops: Array<{
		at: number;
		color: string;
	}>;
}
/** Decoration at a line's tip. Sized relative to the stroke width. */
export type LineEnding = "none" | "arrow" | "dot" | "bar";
export interface ShapeElement extends ElementBase {
	type: "shape";
	shape: ShapeKind;
	fill: string;
	/** when set, wins over `fill` (which is kept as the solid fallback) */
	fillGradient?: GradientFill;
	stroke: string;
	strokeWidth: number;
	/** corner radius, rect only */
	radius: number;
	/** dash length in px; 0/undefined = solid stroke (legacy — see strokeStyle) */
	strokeDash?: number;
	/** stroke pattern; wins over strokeDash when set */
	strokeStyle?: "solid" | "dashed" | "dotted";
	/** line shape only: tip decorations */
	lineStart?: LineEnding;
	lineEnd?: LineEnding;
	/** path only: SVG path data in the coordinate space given by pathBox */
	d?: string;
	/** path only: [x, y, w, h] viewBox the path was authored in */
	pathBox?: [
		number,
		number,
		number,
		number
	];
	/**
	 * Connector anchoring (line/path only): the start (`from`) and/or end (`to`)
	 * of the shape follow another element. The geometry is DERIVED — the editor's
	 * syncConnectors() recomputes the endpoint on that element's border toward the
	 * other end whenever anything moves. A dangling ref (element deleted) is
	 * dropped and the endpoint becomes free.
	 */
	from?: ConnectorEnd;
	to?: ConnectorEnd;
}
/** One anchored end of a connector. `side:'auto'` picks the nearest border. */
export interface ConnectorEnd {
	el: string;
	side?: "auto" | "top" | "right" | "bottom" | "left";
}
export interface ImageElement extends ElementBase {
	type: "image";
	/** data: URI, or "asset:<key>" referencing doc.assets */
	src: string;
	fit: "contain" | "cover" | "fill";
	radius: number;
}
export interface SvgElement extends ElementBase {
	type: "svg";
	/** key into doc.assets holding raw SVG markup (preferred: dedupes) */
	asset?: string;
	/** raw inline SVG markup, used when asset is unset */
	markup?: string;
	/**
	 * CSS injected inside the svg — hover states, focus dims, and animations
	 * live here and stay self-contained (svg <style> scopes to its svg).
	 */
	css?: string;
}
/**
 * Data chart rendered by ECharts. `option` is a PURE-JSON ECharts option
 * (template-string formatters only — never functions): static SVG snapshots
 * on the editor canvas/thumbnails/print, a live interactive instance
 * (tooltips, dataZoom) while presenting.
 */
export interface ChartElement extends ElementBase {
	type: "chart";
	/** preset key the panel offers to re-seed from (bar/line/pie/scatter) */
	preset?: string;
	option: Record<string, unknown>;
	/** live data binding: xAxis labels + series values track this table element */
	source?: {
		tableId: string;
	};
}
/** One cell of a table. `html` is the same sanitized inline subset as text. */
export interface TableCell {
	html: string;
	align?: "left" | "center" | "right";
	/** per-cell overrides (default from the table's style) */
	color?: string;
	bg?: string;
	bold?: boolean;
}
export interface TableRow {
	cells: TableCell[];
}
/** Table-wide look. Cohesion lives here; cells carry only overrides. */
export interface TableStyle {
	headerBg: string;
	headerColor: string;
	/** stripe colour for alternate body rows; absent = no zebra */
	zebra?: string;
	borderColor: string;
	borderWidth: number;
	cellPadX: number;
	cellPadY: number;
	fontSize: number;
	fontFamily?: string;
	/** default body-cell text colour */
	color: string;
	/** outer corner radius (px) */
	radius: number;
}
/**
 * A data table rendered as a real HTML <table> (table-layout: fixed) by the
 * shared renderer — identical on the editor canvas, thumbnails, present and
 * print. Column widths are fractional weights, normalised at render. Morphs
 * as a box (position/size + style colours); cell CONTENT does not morph.
 */
export interface TableElement extends ElementBase {
	type: "table";
	/** fractional column weights; length = column count */
	columns: Array<{
		w: number;
	}>;
	rows: TableRow[];
	/** treat row 0 as a styled header row */
	header: boolean;
	style: TableStyle;
}
/**
 * Audio or video. Hybrid storage: `src` is a data: URI (embedded — travels
 * inside the .bento.html), an external URL / relative path (referenced — keeps
 * the file small but needs the network / a sibling file), or "asset:<key>".
 * The editor embeds small clips and warns above MEDIA_EMBED_BUDGET, offering a
 * URL instead. Autoplay only fires in PRESENT mode (never on the canvas or in
 * thumbnails).
 */
export interface MediaElement extends ElementBase {
	type: "media";
	kind: "video" | "audio";
	src: string;
	/** video only: a still shown before playback (data:/asset:/URL) */
	poster?: string;
	/** video only: fit within the element box */
	fit?: "contain" | "cover" | "fill";
	radius?: number;
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	controls?: boolean;
}
type SlideElement$1 = TextElement | ShapeElement | ImageElement | SvgElement | ChartElement | TableElement | MediaElement;
/**
 * A review comment thread. Editor-only metadata: never rendered while
 * presenting or printing, but saved in the file so it travels with the
 * document when people pass it around.
 */
interface Comment$1 {
	id: string;
	/** element the thread is anchored to; absent (or dangling) = the slide */
	elementId?: string;
	/** point anchor in slide coordinates — used when no elementId is set */
	x?: number;
	y?: number;
	author: string;
	text: string;
	/** ISO datetime */
	at: string;
	resolved?: boolean;
	replies?: Array<{
		id: string;
		author: string;
		text: string;
		at: string;
	}>;
}
export interface Slide {
	id: string;
	background: string;
	transition: TransitionKind;
	elements: SlideElement$1[];
	notes: string;
	/** optional friendly name (link pickers, state badges) */
	name?: string;
	/**
	 * Interactive state: this slide is a variant of the slide with the given
	 * id. It is hidden from linear navigation — reachable only via element
	 * links (and morphs smoothly when element ids are shared with its parent).
	 * While on a state: ArrowLeft returns to the parent, ArrowRight continues
	 * after the parent.
	 */
	stateOf?: string;
	/**
	 * Hidden from the show: skipped by linear navigation, left out of PDF
	 * export, and never chosen as the file's thumbnail — but still an ordinary
	 * slide you can edit, and still reachable by an element `link`, which is
	 * what makes it useful for backup and appendix material you jump to only
	 * if asked.
	 *
	 * Distinct from `stateOf`: a state is a VARIANT OF another slide (← returns
	 * to its parent, and it morphs with it). Hidden carries no such
	 * relationship — it is simply out of the linear flow.
	 *
	 * By default a hidden slide does not consume a page number either, so the
	 * audience sees 1..N with no gaps; `doc.present.numberHidden` restores the
	 * office-suite behaviour of counting it.
	 */
	hidden?: boolean;
	/**
	 * present-mode hover behaviour:
	 * - focus-group: dim every element outside the hovered element's group
	 * - reveal: show the showOnHover set matching the hovered group
	 *   (`default` names the set visible when nothing is hovered)
	 */
	hover?: {
		type: "focus-group" | "reveal";
		dim?: number;
		default?: string;
	};
	/** review comment threads (editor-only; see Comment) */
	comments?: Comment$1[];
}
export interface BentoDoc {
	format: typeof FORMAT;
	version: number;
	/**
	 * Stable per-document identity (uuid), minted at creation and preserved
	 * for the document's whole life — the rendezvous key for future
	 * sync / share / merge features. Never derived from content.
	 */
	docId: string;
	title: string;
	/**
	 * Optional document properties for template fields ({{author}}, {{company}},
	 * {{subject}}, {{event}}) and general provenance. All optional → old files
	 * simply lack it and every token resolves to empty. `title` stays top-level
	 * (load-bearing) and remains the source of {{title}}.
	 */
	meta?: {
		author?: string;
		company?: string;
		subject?: string;
		event?: string;
		keywords?: string;
	};
	/** slide coordinate space, px */
	size: {
		width: number;
		height: number;
	};
	theme: {
		background: string;
		color: string;
		accent: string;
		fontFamily: string;
		/** ordered series colours for new charts; derived from accent when absent */
		chartPalette?: string[];
		/** defaults for newly inserted tables; omitted decks keep the standard look */
		table?: Partial<TableStyle>;
	};
	/** present-mode chrome; decks with built-in chrome can turn Reveal's off */
	present?: {
		/**
		 * Count hidden slides in {{page}}/{{pages}} and the presenter's counter.
		 *
		 * Default (absent/false): they are skipped, matching interactive states —
		 * one rule, "skipped means uncounted", and contiguous numbering falls out
		 * of it. True restores what PowerPoint and Keynote do, where a hidden
		 * slide keeps its number so the visible ones do not renumber as you toggle
		 * slides in and out during rehearsal.
		 */
		numberHidden?: boolean;
		slideNumber?: boolean;
		controls?: boolean;
		progress?: boolean;
	};
	/** shared assets (raw SVG markup or data URIs), referenced by key */
	assets?: Record<string, string>;
	/**
	 * Live-collab blob references for LARGE assets (docs/blob-offload.md).
	 *
	 * An asset over BLOB_INLINE_MAX cannot travel as a CRDT op — a Durable
	 * Object storage value caps near 2MB — so its bytes go to the relay's blob
	 * store and only this tiny reference is synced. Receiving peers fetch,
	 * decrypt and materialise the asset into `assets` themselves.
	 *
	 * NOT part of the document at rest in any meaningful sense: a saved file
	 * carries the real bytes in `assets`, and opening it standalone ignores this
	 * map entirely. It is additive and optional — older builds simply preserve
	 * it as an unknown field.
	 */
	blobs?: Record<string, {
		key: string;
		mime: string;
		size: number;
	}>;
	/**
	 * embedded fonts: each entry becomes an @font-face at boot, with the font
	 * data living in assets (data: URI). Elements then use `family` normally.
	 */
	fonts?: Array<{
		family: string;
		asset: string;
		weight?: string;
		style?: string;
	}>;
	/**
	 * Slide layouts: slide-shaped templates that live outside slides[].
	 * Instantiating one deep-copies its elements KEEPING their ids — slides
	 * born from the same layout share ids, so their common chrome morphs
	 * across transitions and stays traceable for a future re-apply merge.
	 * When absent, the editor offers its built-in starter layouts.
	 */
	layouts?: Slide[];
	/**
	 * Live-collaboration credentials (bento-sync), minted AT CREATION so any
	 * copy of the file can join once sharing is turned on ("send the file
	 * first, share later" just works). `room` is the relay WebSocket URL
	 * (random id — never derived from docId), `key` the base64url AES-GCM
	 * room key. `on` gates auto-join: absent = true (v0.8.0 files only carried
	 * collab while actively shared). Possession of a copy IS the capability;
	 * "Rotate keys" re-mints both to cut old copies off. `sync` is the saved
	 * CRDT state (registers/liveness/text) stamped at save-time on shared
	 * documents — it is what lets an offline-edited copy rejoin as a true
	 * fork and merge both ways. Never transmitted as sync ops.
	 */
	collab?: {
		room: string;
		key: string;
		on?: boolean;
		sync?: SyncStateJSON;
		/**
		 * Signed writes (v0.9.18+): the WRITE capability is an ECDSA P-256 keypair,
		 * distinct from the symmetric `key` (the READ capability). `writerPub`
		 * (raw, base64url) travels in EVERY copy so the relay can verify authorship;
		 * `writerPriv` (PKCS#8, base64url) travels ONLY in writer copies. A
		 * read-only copy is a writer copy with `writerPriv` stripped — the relay
		 * (for `w`-scheme rooms) then drops any op it tries to send. Absent on
		 * legacy `r`-scheme rooms, which stay permissive. See docs/collab-design.md.
		 */
		writerPub?: string;
		writerPriv?: string;
		/** 'reader' = this copy is a live viewer: receives updates, never sends. */
		role?: "writer" | "reader";
		/**
		 * Fine-grained access (v1.0.3+, `v: 2`): per-person keys. The room id
		 * commits to the OWNER's pubkey. A member copy carries an INVITE — an
		 * owner-signed delegation keypair — and each device mints its own identity
		 * key (kept in localStorage, never in the file); the chain
		 * owner → invite → member is what the blind relay verifies. `ownerPriv`
		 * travels ONLY in the owner's own copy. See docs/collab-design.md roadmap.
		 */
		v?: number;
		owner?: string;
		ownerPriv?: string;
		invite?: {
			pub: string;
			priv: string;
			role: "writer" | "commenter";
			/** unix ms expiry; 0/absent = no expiry */
			exp?: number;
			/** owner's signature over `inv.${pub}.${role}.${exp||0}` */
			sig: string;
		};
	};
	/**
	 * Template file (.dotx-style): every OPEN instantiates a fresh document —
	 * parseDoc strips this flag, mints a new docId and drops collab, so each
	 * person who opens the template gets an independent deck with its own
	 * identity and credentials. The template file itself never changes (there
	 * is no file handle until the user's first save-as).
	 */
	template?: boolean;
	/**
	 * A read-only PLAYER file: boots straight into the presentation and never
	 * shows the editor. Honor-system (the JSON is right there), but it makes a
	 * hand-out copy present-only for everyone who doesn't go digging.
	 */
	readonly?: boolean;
	slides: Slide[];
	modified: string;
}
export declare const uid: (prefix?: string) => string;
export declare const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
/**
 * An element's effective morph key: the `morphId` override when set, else its
 * own `id`. THE single definition — render.ts stamps it into `data-flip-id`,
 * present.ts pairs and looks up model frames by it, and the panel uses it for
 * collision checks. Computing it inline in more than one place is exactly how
 * issue #54 happened: present.ts's model map keyed by `id` while every lookup
 * passed a flip id, so any element carrying a `morphId` silently missed and
 * never morphed. Route every morph-key read through here.
 */
export declare function morphKey(el: Pick<ElementBase, "id" | "morphId">): string;
/** True when a background reads as light (so it wants dark text on top). Accepts
 *  a #rrggbb hex; for a gradient/CSS string it samples the first hex it finds and
 *  falls back to "light" (the safe assumption for the model's dark default ink). */
export declare function isLightBg(bg: string): boolean;
/** A text colour that stays legible on the given background — new text/tables use
 *  this so a fresh element is never invisible on a dark deck. */
export declare function readableInk(bg: string): string;
export declare function defaultText(partial?: Partial<TextElement>): TextElement;
export declare function deriveChartPalette(accent: string): string[];
/** First column = x labels; each mostly-numeric column after = a data series. */
export declare function tableChartColumns(table: TableElement): {
	labels: string[];
	cols: Array<{
		name: string;
		data: number[];
		isPct: boolean;
	}>;
};
/**
 * Push a linked table's current values into a chart's option IN PLACE,
 * preserving the chart's styling/axis config (only xAxis labels + each series'
 * data change). Returns true if anything changed. Series map to numeric columns
 * by position; extra series/columns are left untouched.
 */
export declare function syncLinkedChart(chart: ChartElement, table: TableElement): boolean;
export declare function chartColorsFor(theme: BentoDoc["theme"]): string[];
/** Give a chart option the deck's palette unless it already sets explicit colours. */
export declare function applyChartPalette<T extends Record<string, unknown>>(option: T, theme: BentoDoc["theme"]): T;
export declare function defaultChart(option: Record<string, unknown>, partial?: Partial<ChartElement>): ChartElement;
/** Resolve a new table's style from built-in defaults and optional deck overrides. */
export declare function tableStyleFor(theme?: BentoDoc["theme"]): TableStyle;
export declare function defaultTable(partial?: Partial<TableElement>, theme?: BentoDoc["theme"]): TableElement;
export declare function defaultShape(shape: ShapeKind, partial?: Partial<ShapeElement>): ShapeElement;
export declare function defaultImage(src: string, partial?: Partial<ImageElement>): ImageElement;
/** Park an embedded data URI in `doc.assets` and return an `asset:` ref.
 *
 *  Every embed goes through here so there is exactly ONE place binary content
 *  lives. That matters beyond tidiness: live collab offloads large `assets`
 *  entries to the relay's blob store, so an image written straight onto
 *  `el.src` was invisible to the offload and rode inline in an op batch far
 *  too big for a frame — it reached collaborators as nothing at all.
 *
 *  Identical bytes reuse the same key, so duplicating an image (or pasting the
 *  same photo twice) costs one copy in the file and one upload on the wire.
 *  A URL or an existing `asset:` ref passes straight through — only `data:`
 *  is interned. Callers MUST run this inside a `store.commit` so the assets
 *  write is part of the same undo step and the same sync batch. */
export declare function internAsset(doc: BentoDoc, src: string): string;
/** Soft ceiling for embedding media as a data URI (bytes). Above this the
 *  editor warns — a big embed makes the .bento.html slow to open and save. */
export declare const MEDIA_EMBED_BUDGET: number;
/**
 * Hard ceiling for the static first-page preview every save writes into the
 * shell (src/preview.ts), in bytes of serialized markup.
 *
 * Unlike MEDIA_EMBED_BUDGET this is not a warning the author can wave through
 * — there is no author in the loop, it is spent silently on every ⌘S, and it
 * is spent on a THUMBNAIL. A text page costs 2–5 KB. The thing that can blow
 * up is a full-bleed photo, whose data URI would be duplicated: once in the
 * document, once in the preview.
 *
 * 64 KB is ~10% of the shipped shell (~640 KB compressed): invisible against a
 * file that size, and enough for a real page plus a logo or an icon-sized
 * image. Measured: the starter deck's page one costs 25 KB (2.6% of it). Over
 * it, preview.ts degrades — first dropping raster payloads, then falling back
 * to a title card — rather than growing the file.
 */
export declare const PREVIEW_BUDGET: number;
export declare function defaultMedia(kind: "video" | "audio", src: string, partial?: Partial<MediaElement>): MediaElement;
export declare function emptySlide(partial?: Partial<Slide>): Slide;
/**
 * The layouts every document offers out of the box (not persisted until edited).
 * Pass the deck's page size to get geometry that fits it; omit it only when the
 * caller just wants the element ids.
 */
export declare function builtinLayouts(size?: {
	width: number;
	height: number;
}): Slide[];
/** A fresh slide from a layout — new slide id, element ids KEPT (lineage). */
export declare function instantiateLayout(layout: Slide): Slide;
/**
 * Apply a layout to an existing slide's elements. The matching ladder:
 *   1. by id     — re-applying the slide's own layout resets frames/typography
 *                  while keeping content
 *   2. by role   — cross-layout: the slide's 'title' moves into the new
 *                  layout's 'title' frame (same element type required;
 *                  donors consumed in document order)
 * Content (text html, link) rides along; the layout provides frame and
 * typography. Leftover slide elements that belong to some KNOWN layout
 * (old chrome, unfilled placeholders) are dropped; everything else is user
 * content and survives on top of the new layout's elements.
 */
export declare function applyLayout(slide: Slide, layout: Slide, knownLayoutElementIds: Set<string>): SlideElement$1[];
/** Every element id owned by any known layout (built-ins + the document's). */
export declare function layoutElementIds(doc: BentoDoc): Set<string>;
/**
 * Does this slide consume a page number?
 *
 * The single answer to that question — page fields, the presenter's counter,
 * the sidebar — so they cannot disagree about which slide is "4". Interactive
 * states never count; hidden slides count only when the deck opts into
 * office-suite numbering.
 */
export declare const paginates: (s: Slide, doc: BentoDoc) => boolean;
/**
 * Is this slide part of the linear walk?
 *
 * Deliberately NOT the same question as `paginates`. Navigation, PDF export and
 * the file thumbnail all skip states and hidden slides unconditionally; only
 * NUMBERING is configurable. Collapsing the two would make `numberHidden` walk
 * the audience into a slide that was hidden on purpose.
 */
export declare const inLinearFlow: (s: Slide) => boolean;
export declare const newDocId: () => string;
export declare function newDoc(): BentoDoc;
export declare function parseDoc(json: string): BentoDoc | null;

export {
	Comment$1 as Comment,
	SlideElement$1 as SlideElement,
};

export {};
