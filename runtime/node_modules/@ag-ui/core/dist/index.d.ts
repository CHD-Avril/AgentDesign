import { $ as ReplaceOperation, A as JsonPointer, At as TextMessageStartEvent, B as PartSource, Bt as ToolMessage, C as FunctionCall, Ct as SubagentStartedEvent, D as Interrupt, Dt as TextMessageContentEvent, E as ImagePart, Et as TextMessageChunkEvent, F as MultiAgentCapabilities, Ft as ToolCallArgsEvent, G as ReasoningEndEvent, Gt as VideoPart, H as ReasoningCapabilities, Ht as TransportCapabilities, I as MultimodalCapabilities, It as ToolCallChunkEvent, J as ReasoningMessageContentEvent, K as ReasoningMessage, L as MultimodalInputCapabilities, Lt as ToolCallEndEvent, M as MessagesSnapshotEvent, Mt as TokenUsage, N as Metadata, Nt as Tool, O as JsonPatch, Ot as TextMessageEndEvent, P as MoveOperation, Pt as ToolCall, Q as RemoveOperation, R as MultimodalOutputCapabilities, Rt as ToolCallResultEvent, S as FileSource, St as SubagentRunId, T as IdentityCapabilities, Tt as TestOperation, U as ReasoningEncryptedValueEvent, Ut as UrlSource, V as RawEvent, Vt as ToolsCapabilities, W as ReasoningEncryptedValueSubtype, Wt as UserMessage, X as ReasoningMessageStartEvent, Y as ReasoningMessageEndEvent, Z as ReasoningStartEvent, _ as DeveloperMessage, _t as SubagentFinishedEvent, a as AddOperation, at as RunFinishedEvent, b as EventType, bt as SubagentFinishedSuspendedOutcome, c as Attributable, ct as RunFinishedSuccessOutcome, d as BaseMessage, dt as StateCapabilities, et as ResumeEntry, f as ContentPart, ft as StateDeltaEvent, g as DataSource, gt as SubagentErrorEvent, h as CustomEvent, ht as StepStartedEvent, i as ActivitySnapshotEvent, it as RunFinishedCancelledOutcome, j as Message, jt as TextPart, k as JsonPatchOperation, kt as TextMessageRole, l as AudioPart, lt as RunStartedEvent, m as CopyOperation, mt as StepFinishedEvent, n as ActivityDeltaEvent, nt as RunAgentInput, o as AgentCapabilities, ot as RunFinishedInterruptOutcome, p as Context, pt as StateSnapshotEvent, q as ReasoningMessageChunkEvent, r as ActivityMessage, rt as RunErrorEvent, s as AssistantMessage, st as RunFinishedOutcome, t as PROTOCOL_VERSION, tt as Role, u as BaseEvent$1, ut as State, v as DocumentPart, vt as SubagentFinishedOutcome, w as HumanInTheLoopCapabilities, wt as SystemMessage, x as ExecutionCapabilities, xt as SubagentInfo, y as Event, yt as SubagentFinishedSuccessOutcome, z as OutputCapabilities, zt as ToolCallStartEvent } from "./version-DEKfpZNa.js";

//#region src/generated/serialization.d.ts
/**
 * Omits whole optional null fields before transmission. Does not validate,
 * mutate the input, or traverse arbitrary application JSON or unknown fields.
 * Required null payloads and null values inside opaque data remain intact.
 */
declare function omitOptionalNulls<T>(value: T, root: "Event" | "RunAgentInput"): T;
//#endregion
//#region src/compat.d.ts
/**
 * Compatibility layer: the names this package has always exported, pointed at
 * the generated protocol source. Everything protocol-shaped lives in
 * src/generated (regenerate with `pnpm --filter @ag-ui/spec generate`); this
 * file only aliases, derives, and carries the package's own error types.
 */
/** Every protocol event, under its historic name (the generated name is Event). */
type AGUIEvent = Event;
/**
 * The historic BaseEvent shape: the protocol's base fields plus an open index
 * signature. The hand-written type inherited the index signature from zod's
 * passthrough inference, and client code reads event-specific fields straight
 * off a BaseEvent, so the compat surface keeps it. The exact protocol shape
 * is the generated BaseEvent; the closed union of real events is `Event`.
 */
type BaseEvent = BaseEvent$1 & {
  [key: string]: unknown;
};
/** The fields every event carries, under their historic name. */
type BaseEventFields = BaseEvent;
/** Event type discriminator -> concrete event, derived from the union. */
type AGUIEventByType = { [K in EventType]: Extract<Event, {
  type: K;
}> };
type AGUIEventOf<T extends EventType> = AGUIEventByType[T];
type EventPayloadOf<T extends EventType> = T extends EventType ? Omit<AGUIEventOf<T>, keyof BaseEvent$1> : never;
/**
 * What a factory takes: the event's fields, minus the discriminator the
 * factory sets. Derived from the generated event types rather than from
 * z.input of the loose validators — a looseObject's input type carries a
 * string index signature, and Omit over that erases every named field, which
 * would let `{}` or a wrong-typed field compile. The trailing open signature
 * keeps the historic tolerance for extra keys.
 */
type EventProps<E extends {
  type: EventType;
}> = Omit<E, "type"> & {
  [key: string]: unknown;
};
type BaseEventProps = EventProps<BaseEvent$1>;
type TextMessageStartEventProps = EventProps<TextMessageStartEvent>;
type TextMessageContentEventProps = EventProps<TextMessageContentEvent>;
type TextMessageEndEventProps = EventProps<TextMessageEndEvent>;
type TextMessageChunkEventProps = EventProps<TextMessageChunkEvent>;
type ToolCallStartEventProps = EventProps<ToolCallStartEvent>;
type ToolCallArgsEventProps = EventProps<ToolCallArgsEvent>;
type ToolCallEndEventProps = EventProps<ToolCallEndEvent>;
type ToolCallChunkEventProps = EventProps<ToolCallChunkEvent>;
type ToolCallResultEventProps = EventProps<ToolCallResultEvent>;
type StateSnapshotEventProps = EventProps<StateSnapshotEvent>;
type StateDeltaEventProps = EventProps<StateDeltaEvent>;
type MessagesSnapshotEventProps = EventProps<MessagesSnapshotEvent>;
type ActivitySnapshotEventProps = EventProps<ActivitySnapshotEvent>;
type ActivityDeltaEventProps = EventProps<ActivityDeltaEvent>;
type RawEventProps = EventProps<RawEvent>;
type CustomEventProps = EventProps<CustomEvent>;
type RunStartedEventProps = EventProps<RunStartedEvent>;
type RunFinishedEventProps = EventProps<RunFinishedEvent>;
type RunErrorEventProps = EventProps<RunErrorEvent>;
type StepStartedEventProps = EventProps<StepStartedEvent>;
type StepFinishedEventProps = EventProps<StepFinishedEvent>;
type ReasoningStartEventProps = EventProps<ReasoningStartEvent>;
type ReasoningMessageStartEventProps = EventProps<ReasoningMessageStartEvent>;
type ReasoningMessageContentEventProps = EventProps<ReasoningMessageContentEvent>;
type ReasoningMessageEndEventProps = EventProps<ReasoningMessageEndEvent>;
type ReasoningMessageChunkEventProps = EventProps<ReasoningMessageChunkEvent>;
type ReasoningEndEventProps = EventProps<ReasoningEndEvent>;
type ReasoningEncryptedValueEventProps = EventProps<ReasoningEncryptedValueEvent>;
type SubagentStartedEventProps = EventProps<SubagentStartedEvent>;
type SubagentFinishedEventProps = EventProps<SubagentFinishedEvent>;
type SubagentErrorEventProps = EventProps<SubagentErrorEvent>;
/**
 * The names the content parts carried before 1.0 renamed them (InputContent
 * -> ContentPart, TextInputContent -> TextPart, and so on): the same parts now
 * sit on tool messages as well as user messages, so they are named by what
 * they are rather than by direction. The wire is unchanged — every `type`
 * value is the same — and so is every type behind these names; only the
 * spelling moved. Kept for one release, see DEPRECATIONS.md. The matching
 * validator aliases live in src/schemas.ts, which is where every runtime
 * validator this package ships lives.
 *
 * @deprecated Use the ...Part names.
 */
type InputContent = ContentPart;
/** @deprecated Use TextPart. */
type TextInputContent = TextPart;
/** @deprecated Use ImagePart. */
type ImageInputContent = ImagePart;
/** @deprecated Use AudioPart. */
type AudioInputContent = AudioPart;
/** @deprecated Use VideoPart. */
type VideoInputContent = VideoPart;
/** @deprecated Use DocumentPart. */
type DocumentInputContent = DocumentPart;
/** @deprecated Use PartSource. */
type InputContentSource = PartSource;
/** @deprecated Use DataSource. */
type InputContentDataSource = DataSource;
/** @deprecated Use UrlSource. */
type InputContentUrlSource = UrlSource;
/** Historic alias: a content part of a user message. */
type InputContentPart = ContentPart;
/** Whether an interrupt was answered or abandoned. */
type ResumeStatus = ResumeEntry["status"];
declare class AGUIError extends Error {
  constructor(message: string);
}
declare class AGUIConnectNotImplementedError extends AGUIError {
  constructor();
}
//#endregion
//#region src/metadata.d.ts
/**
 * The key reserved for AG-UI's own use inside a metadata object. Every other
 * key is user space.
 *
 * Reservation is by convention: nothing rejects a write to this key at runtime,
 * because metadata is open by key and validating its shape would contradict
 * that.
 */
declare const AGUI_METADATA_KEY = "ag-ui";
/**
 * Extra information attached to an event or a message.
 *
 * Open by key — any JSON value is allowed under a key, including `null`.
 *
 * Deliberately `z.any()` rather than a recursive JSON-value schema, which review
 * has suggested more than once. Two reasons. Every dynamic payload in the
 * protocol uses the permissive form — `state`, `rawEvent`, `CustomEvent.value`,
 * `ActivityMessage.content`, and the pre-existing `Tool.metadata` and
 * `Interrupt.metadata` — so tightening this one field would make it the sole
 * outlier while fixing nothing elsewhere. And a recursive validation would walk
 * every value on every event, on the streaming hot path, to catch a mistake
 * (a function, a bigint) that already fails loudly at encode time.
 *
 * The schema itself now lives in the generated source (MetadataSchema in
 * src/generated/schemas.ts); this comment survives as the recorded reasoning.
 */
/**
 * How metadata is declared on events and messages: the object is absent or an
 * object, never `null`. The validator pinning that invariant is
 * `OptionalMetadataSchema`, which lives in src/schemas.ts along with every
 * other runtime validator this package ships.
 */
/**
 * Folds `incoming` metadata into `existing`, key by key, with the last write
 * winning.
 *
 * A message is assembled from a sequence of events, and the interesting values
 * — token usage and finish reason among them — are only known at the end. So
 * metadata accumulates as the sequence arrives rather than being fixed at the
 * start.
 *
 * A key's value is replaced outright. This never recurses, so an array or
 * object under any key — including {@link AGUI_METADATA_KEY} — is replaced
 * wholesale rather than blended with what was there before.
 *
 * Returns a new object rather than mutating either argument. An absent
 * `incoming` returns `existing` untouched; an empty `incoming` changes nothing.
 */
declare function mergeMetadata(existing: Metadata | undefined, incoming: Metadata | undefined): Metadata | undefined;
//#endregion
//#region src/token-usage.d.ts
/**
 * Map a LangChain-family `usage_metadata` object into an AG-UI {@link TokenUsage}.
 *
 * LangChain and LangGraph both attach usage as `{ input_tokens, output_tokens,
 * total_tokens, input_token_details: { cache_read, cache_creation },
 * output_token_details: { reasoning } }`. LangChain's accounting is the
 * protocol's — `input_tokens` already includes the cache details and
 * `output_tokens` the reasoning detail — so every count passes through as is.
 * This maps only those numeric counts plus optional provider/model labels —
 * never prompt/completion content. A count the provider
 * did not return is simply absent from `usage_metadata` and reads as
 * `undefined` here; that is not a defect and draws no warning. Returns
 * `undefined` when no usable count is present, so callers can omit usage rather
 * than report zeros.
 */
declare function tokenUsageFromLangChainMetadata(usageMetadata: unknown, {
  provider,
  model
}: {
  provider?: string;
  model?: string;
}): TokenUsage | undefined;
/**
 * Map an AI-SDK `LanguageModelUsage` object into an AG-UI {@link TokenUsage}.
 *
 * AI-SDK's v5 keys already match — `inputTokens`, `outputTokens`,
 * `totalTokens`, `reasoningTokens`, `cachedInputTokens` — with the totals
 * inclusive the way the protocol counts them. v6 adds `inputTokenDetails:
 * { cacheReadTokens, cacheWriteTokens }` and `outputTokenDetails:
 * { reasoningTokens }`; the cache-write count exists only there, and the two
 * counts present in both forms are read from the top level first. AI-SDK
 * reports `NaN`/`undefined` for counts a provider didn't return, so only finite
 * numbers are copied. Returns `undefined` when no finite count is present (so
 * callers omit empty usage).
 */
declare function tokenUsageFromAiSdkUsage(usage: unknown, {
  provider,
  model
}: {
  provider?: string;
  model?: string;
}): TokenUsage | undefined;
/**
 * Sum per-call {@link TokenUsage} entries into one entry per `(provider, model)`
 * pair. Order follows first appearance. A count field stays `undefined` when no
 * member of the group reported it, so "not reported" stays distinct from zero.
 *
 * Protocol-agnostic: works on any producer's `TokenUsage[]`, so integrations
 * share it rather than reimplementing aggregation.
 */
declare function aggregateTokenUsage(entries: TokenUsage[]): TokenUsage[];
//#endregion
//#region src/content.d.ts
/**
 * The text of string-or-parts content, for a consumer that can only hold a
 * string: the text parts concatenated in order, every other part dropped.
 *
 * This is the downgrade the specification permits for a peer that predates
 * content parts (/spec/1.0/basic/versioning): it removes and reshapes, and
 * it invents nothing — no placeholder stands in for a dropped image, because a
 * downgrade MUST NOT supply a value the producer never sent. Content that is
 * entirely media flattens to the empty string, which the same rule allows.
 *
 * Losing content is never meant to be silent. This helper only reshapes; a
 * caller that knows it is talking to an older peer warns as well, the way the
 * era shims in `@ag-ui/client` do.
 */
declare function contentToText(content: string | ContentPart[] | undefined): string;
/**
 * Whether string-or-parts content carries anything but text — the question a
 * caller asks before flattening, so it can warn about what the flattening
 * would drop.
 */
declare function contentHasMedia(content: string | ContentPart[] | undefined): boolean;
//#endregion
export { AGUIConnectNotImplementedError, AGUIError, AGUIEvent, AGUIEventByType, AGUIEventOf, AGUI_METADATA_KEY, ActivityDeltaEvent, ActivityDeltaEventProps, ActivityMessage, ActivitySnapshotEvent, ActivitySnapshotEventProps, AddOperation, AgentCapabilities, AssistantMessage, Attributable, AudioInputContent, type AudioPart as AudioInputPart, AudioPart, type BaseEvent, BaseEventFields, BaseEventProps, BaseMessage, ContentPart, Context, CopyOperation, CustomEvent, CustomEventProps, DataSource, DeveloperMessage, DocumentInputContent, type DocumentPart as DocumentInputPart, DocumentPart, Event, EventPayloadOf, EventType, ExecutionCapabilities, FileSource, FunctionCall, HumanInTheLoopCapabilities, IdentityCapabilities, ImageInputContent, type ImagePart as ImageInputPart, ImagePart, InputContent, InputContentDataSource, InputContentPart, InputContentSource, InputContentUrlSource, Interrupt, JsonPatch, JsonPatchOperation, JsonPointer, Message, MessagesSnapshotEvent, MessagesSnapshotEventProps, Metadata, MoveOperation, MultiAgentCapabilities, MultimodalCapabilities, MultimodalInputCapabilities, MultimodalOutputCapabilities, OutputCapabilities, PROTOCOL_VERSION, PartSource, RawEvent, RawEventProps, ReasoningCapabilities, ReasoningEncryptedValueEvent, ReasoningEncryptedValueEventProps, ReasoningEncryptedValueSubtype, ReasoningEndEvent, ReasoningEndEventProps, ReasoningMessage, ReasoningMessageChunkEvent, ReasoningMessageChunkEventProps, ReasoningMessageContentEvent, ReasoningMessageContentEventProps, ReasoningMessageEndEvent, ReasoningMessageEndEventProps, ReasoningMessageStartEvent, ReasoningMessageStartEventProps, ReasoningStartEvent, ReasoningStartEventProps, RemoveOperation, ReplaceOperation, ResumeEntry, ResumeStatus, Role, RunAgentInput, RunErrorEvent, RunErrorEventProps, RunFinishedCancelledOutcome, RunFinishedEvent, RunFinishedEventProps, RunFinishedInterruptOutcome, RunFinishedOutcome, RunFinishedSuccessOutcome, RunStartedEvent, RunStartedEventProps, State, StateCapabilities, StateDeltaEvent, StateDeltaEventProps, StateSnapshotEvent, StateSnapshotEventProps, StepFinishedEvent, StepFinishedEventProps, StepStartedEvent, StepStartedEventProps, SubagentErrorEvent, SubagentErrorEventProps, SubagentFinishedEvent, SubagentFinishedEventProps, SubagentFinishedOutcome, SubagentFinishedSuccessOutcome, SubagentFinishedSuspendedOutcome, SubagentInfo, SubagentRunId, SubagentStartedEvent, SubagentStartedEventProps, SystemMessage, TestOperation, TextInputContent, TextMessageChunkEvent, TextMessageChunkEventProps, TextMessageContentEvent, TextMessageContentEventProps, TextMessageEndEvent, TextMessageEndEventProps, TextMessageRole, TextMessageStartEvent, TextMessageStartEventProps, TextPart, TokenUsage, Tool, ToolCall, ToolCallArgsEvent, ToolCallArgsEventProps, ToolCallChunkEvent, ToolCallChunkEventProps, ToolCallEndEvent, ToolCallEndEventProps, ToolCallResultEvent, ToolCallResultEventProps, ToolCallStartEvent, ToolCallStartEventProps, ToolMessage, ToolsCapabilities, TransportCapabilities, UrlSource, UserMessage, VideoInputContent, type VideoPart as VideoInputPart, VideoPart, aggregateTokenUsage, contentHasMedia, contentToText, mergeMetadata, omitOptionalNulls, tokenUsageFromAiSdkUsage, tokenUsageFromLangChainMetadata };
//# sourceMappingURL=index.d.ts.map