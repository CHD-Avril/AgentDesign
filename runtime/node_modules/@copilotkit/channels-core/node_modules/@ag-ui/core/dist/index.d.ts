import { z } from "zod";

//#region src/types.d.ts
declare const FunctionCallSchema: z.ZodObject<{
  name: z.ZodString;
  arguments: z.ZodString;
}, "strip", z.ZodTypeAny, {
  name: string;
  arguments: string;
}, {
  name: string;
  arguments: string;
}>;
declare const ToolCallSchema: z.ZodObject<{
  id: z.ZodString;
  type: z.ZodLiteral<"function">;
  function: z.ZodObject<{
    name: z.ZodString;
    arguments: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    name: string;
    arguments: string;
  }, {
    name: string;
    arguments: string;
  }>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  function: {
    name: string;
    arguments: string;
  };
  type: "function";
  id: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
}, {
  function: {
    name: string;
    arguments: string;
  };
  type: "function";
  id: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
}>;
declare const BaseMessageSchema: z.ZodObject<{
  id: z.ZodString;
  role: z.ZodString;
  content: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
}>;
declare const TextInputContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
}, "strip", z.ZodTypeAny, {
  type: "text";
  text: string;
}, {
  type: "text";
  text: string;
}>;
declare const InputContentDataSourceSchema: z.ZodObject<{
  type: z.ZodLiteral<"data">;
  value: z.ZodString;
  mimeType: z.ZodString;
}, "strip", z.ZodTypeAny, {
  value: string;
  type: "data";
  mimeType: string;
}, {
  value: string;
  type: "data";
  mimeType: string;
}>;
declare const InputContentUrlSourceSchema: z.ZodObject<{
  type: z.ZodLiteral<"url">;
  value: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  value: string;
  type: "url";
  mimeType?: string | undefined;
}, {
  value: string;
  type: "url";
  mimeType?: string | undefined;
}>;
declare const InputContentSourceSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
  type: z.ZodLiteral<"data">;
  value: z.ZodString;
  mimeType: z.ZodString;
}, "strip", z.ZodTypeAny, {
  value: string;
  type: "data";
  mimeType: string;
}, {
  value: string;
  type: "data";
  mimeType: string;
}>, z.ZodObject<{
  type: z.ZodLiteral<"url">;
  value: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  value: string;
  type: "url";
  mimeType?: string | undefined;
}, {
  value: string;
  type: "url";
  mimeType?: string | undefined;
}>]>;
declare const ImageInputContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"image">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const AudioInputContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const VideoInputContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"video">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const DocumentInputContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"document">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const ImageInputPartSchema: z.ZodObject<{
  type: z.ZodLiteral<"image">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const AudioInputPartSchema: z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const VideoInputPartSchema: z.ZodObject<{
  type: z.ZodLiteral<"video">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const DocumentInputPartSchema: z.ZodObject<{
  type: z.ZodLiteral<"document">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>;
declare const BinaryInputContentSchema: z.ZodEffects<z.ZodObject<{
  type: z.ZodLiteral<"binary">;
  mimeType: z.ZodString;
  id: z.ZodOptional<z.ZodString>;
  url: z.ZodOptional<z.ZodString>;
  data: z.ZodOptional<z.ZodString>;
  filename: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}>, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}>;
declare const InputContentSchema: z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
}, "strip", z.ZodTypeAny, {
  type: "text";
  text: string;
}, {
  type: "text";
  text: string;
}>, z.ZodObject<{
  type: z.ZodLiteral<"image">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>, z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>, z.ZodObject<{
  type: z.ZodLiteral<"video">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>, z.ZodObject<{
  type: z.ZodLiteral<"document">;
  source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"data">;
    value: z.ZodString;
    mimeType: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "data";
    mimeType: string;
  }, {
    value: string;
    type: "data";
    mimeType: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"url">;
    value: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }, {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  }>]>;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}, {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
}>, z.ZodObject<{
  type: z.ZodLiteral<"binary">;
  mimeType: z.ZodString;
  id: z.ZodOptional<z.ZodString>;
  url: z.ZodOptional<z.ZodString>;
  data: z.ZodOptional<z.ZodString>;
  filename: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}, {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}>]>, {
  type: "text";
  text: string;
} | {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}, {
  type: "text";
  text: string;
} | {
  type: "image";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "audio";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "video";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "document";
  source: {
    value: string;
    type: "data";
    mimeType: string;
  } | {
    value: string;
    type: "url";
    mimeType?: string | undefined;
  };
  metadata?: unknown;
} | {
  type: "binary";
  mimeType: string;
  id?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
  filename?: string | undefined;
}>;
declare const DeveloperMessageSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"developer">;
  content: z.ZodString;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "developer";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "developer";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>;
declare const SystemMessageSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"system">;
  content: z.ZodString;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "system";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "system";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>;
declare const AssistantMessageSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"assistant">;
  content: z.ZodOptional<z.ZodString>;
  toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"function">;
    function: z.ZodObject<{
      name: z.ZodString;
      arguments: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      name: string;
      arguments: string;
    }, {
      name: string;
      arguments: string;
    }>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }, {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }>, "many">>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "assistant";
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
  toolCalls?: {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }[] | undefined;
}, {
  id: string;
  role: "assistant";
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
  toolCalls?: {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }[] | undefined;
}>;
declare const UserMessageSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"user">;
  content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    type: "text";
    text: string;
  }, {
    type: "text";
    text: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"video">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"document">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"binary">;
    mimeType: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodString>;
    filename: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }, {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }>]>, {
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }, {
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }>, "many">]>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "user";
  content: string | ({
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  })[];
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "user";
  content: string | ({
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  })[];
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>;
declare const ToolMessageSchema: z.ZodObject<{
  id: z.ZodString;
  content: z.ZodString;
  role: z.ZodLiteral<"tool">;
  toolCallId: z.ZodString;
  error: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "tool";
  content: string;
  toolCallId: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  error?: string | undefined;
}, {
  id: string;
  role: "tool";
  content: string;
  toolCallId: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  error?: string | undefined;
}>;
declare const ActivityMessageSchema: z.ZodObject<{
  id: z.ZodString;
  role: z.ZodLiteral<"activity">;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "activity";
  content: Record<string, any>;
  activityType: string;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "activity";
  content: Record<string, any>;
  activityType: string;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>;
declare const ReasoningMessageSchema: z.ZodObject<{
  id: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  content: z.ZodString;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "reasoning";
  content: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "reasoning";
  content: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>;
declare const MessageSchema: z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"developer">;
  content: z.ZodString;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "developer";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "developer";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"system">;
  content: z.ZodString;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "system";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "system";
  content: string;
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"assistant">;
  content: z.ZodOptional<z.ZodString>;
  toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"function">;
    function: z.ZodObject<{
      name: z.ZodString;
      arguments: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      name: string;
      arguments: string;
    }, {
      name: string;
      arguments: string;
    }>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }, {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }>, "many">>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "assistant";
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
  toolCalls?: {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }[] | undefined;
}, {
  id: string;
  role: "assistant";
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  content?: string | undefined;
  subagentRunId?: string | undefined;
  toolCalls?: {
    function: {
      name: string;
      arguments: string;
    };
    type: "function";
    id: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
  }[] | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  role: z.ZodLiteral<"user">;
  content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    type: "text";
    text: string;
  }, {
    type: "text";
    text: string;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"video">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"document">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"data">;
      value: z.ZodString;
      mimeType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "data";
      mimeType: string;
    }, {
      value: string;
      type: "data";
      mimeType: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"url">;
      value: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }, {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    }>]>;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, "strip", z.ZodTypeAny, {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }, {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  }>, z.ZodObject<{
    type: z.ZodLiteral<"binary">;
    mimeType: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodString>;
    filename: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }, {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }>]>, {
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }, {
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  }>, "many">]>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "user";
  content: string | ({
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  })[];
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "user";
  content: string | ({
    type: "text";
    text: string;
  } | {
    type: "image";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "audio";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "video";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "document";
    source: {
      value: string;
      type: "data";
      mimeType: string;
    } | {
      value: string;
      type: "url";
      mimeType?: string | undefined;
    };
    metadata?: unknown;
  } | {
    type: "binary";
    mimeType: string;
    id?: string | undefined;
    data?: string | undefined;
    url?: string | undefined;
    filename?: string | undefined;
  })[];
  name?: string | undefined;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  content: z.ZodString;
  role: z.ZodLiteral<"tool">;
  toolCallId: z.ZodString;
  error: z.ZodOptional<z.ZodString>;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "tool";
  content: string;
  toolCallId: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  error?: string | undefined;
}, {
  id: string;
  role: "tool";
  content: string;
  toolCallId: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  error?: string | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  role: z.ZodLiteral<"activity">;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "activity";
  content: Record<string, any>;
  activityType: string;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "activity";
  content: Record<string, any>;
  activityType: string;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>, z.ZodObject<{
  id: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  content: z.ZodString;
  encryptedValue: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  id: string;
  role: "reasoning";
  content: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}, {
  id: string;
  role: "reasoning";
  content: string;
  encryptedValue?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
}>]>;
declare const RoleSchema: z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">, z.ZodLiteral<"tool">, z.ZodLiteral<"activity">, z.ZodLiteral<"reasoning">]>;
declare const ContextSchema: z.ZodObject<{
  description: z.ZodString;
  value: z.ZodString;
}, "strip", z.ZodTypeAny, {
  value: string;
  description: string;
}, {
  value: string;
  description: string;
}>;
declare const ToolSchema: z.ZodObject<{
  name: z.ZodString;
  description: z.ZodString;
  parameters: z.ZodAny;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  name: string;
  description: string;
  metadata?: Record<string, any> | undefined;
  parameters?: any;
}, {
  name: string;
  description: string;
  metadata?: Record<string, any> | undefined;
  parameters?: any;
}>;
declare const InterruptSchema: z.ZodObject<{
  id: z.ZodString;
  reason: z.ZodString;
  message: z.ZodOptional<z.ZodString>;
  toolCallId: z.ZodOptional<z.ZodString>;
  responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  expiresAt: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  id: string;
  reason: string;
  message?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  toolCallId?: string | undefined;
  responseSchema?: Record<string, any> | undefined;
  expiresAt?: string | undefined;
}, {
  id: string;
  reason: string;
  message?: string | undefined;
  metadata?: Record<string, any> | undefined;
  subagentRunId?: string | undefined;
  toolCallId?: string | undefined;
  responseSchema?: Record<string, any> | undefined;
  expiresAt?: string | undefined;
}>;
declare const ResumeEntrySchema: z.ZodObject<{
  interruptId: z.ZodString;
  status: z.ZodEnum<["resolved", "cancelled"]>;
  payload: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
  status: "resolved" | "cancelled";
  interruptId: string;
  metadata?: Record<string, any> | undefined;
  payload?: any;
}, {
  status: "resolved" | "cancelled";
  interruptId: string;
  metadata?: Record<string, any> | undefined;
  payload?: any;
}>;
declare const RunAgentInputSchema: z.ZodObject<{
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  state: z.ZodEffects<z.ZodAny, any, any>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
  tools: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    parameters: z.ZodAny;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }>, "many">;
  context: z.ZodArray<z.ZodObject<{
    description: z.ZodString;
    value: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    value: string;
    description: string;
  }, {
    value: string;
    description: string;
  }>, "many">;
  forwardedProps: z.ZodAny;
  resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
    interruptId: z.ZodString;
    status: z.ZodEnum<["resolved", "cancelled"]>;
    payload: z.ZodOptional<z.ZodAny>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    status: "resolved" | "cancelled";
    interruptId: string;
    metadata?: Record<string, any> | undefined;
    payload?: any;
  }, {
    status: "resolved" | "cancelled";
    interruptId: string;
    metadata?: Record<string, any> | undefined;
    payload?: any;
  }>, "many">>;
}, "strip", z.ZodTypeAny, {
  threadId: string;
  runId: string;
  messages: ({
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  } | {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  } | {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  })[];
  tools: {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }[];
  context: {
    value: string;
    description: string;
  }[];
  parentRunId?: string | undefined;
  state?: any;
  forwardedProps?: any;
  resume?: {
    status: "resolved" | "cancelled";
    interruptId: string;
    metadata?: Record<string, any> | undefined;
    payload?: any;
  }[] | undefined;
}, {
  threadId: string;
  runId: string;
  messages: ({
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  } | {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  } | {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  } | {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  })[];
  tools: {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }[];
  context: {
    value: string;
    description: string;
  }[];
  parentRunId?: string | undefined;
  state?: any;
  forwardedProps?: any;
  resume?: {
    status: "resolved" | "cancelled";
    interruptId: string;
    metadata?: Record<string, any> | undefined;
    payload?: any;
  }[] | undefined;
}>;
declare const StateSchema: z.ZodAny;
type ToolCall = z.infer<typeof ToolCallSchema>;
type FunctionCall = z.infer<typeof FunctionCallSchema>;
type TextInputContent = z.infer<typeof TextInputContentSchema>;
type InputContentDataSource = z.infer<typeof InputContentDataSourceSchema>;
type InputContentUrlSource = z.infer<typeof InputContentUrlSourceSchema>;
type InputContentSource = z.infer<typeof InputContentSourceSchema>;
type ImageInputContent = z.infer<typeof ImageInputContentSchema>;
type AudioInputContent = z.infer<typeof AudioInputContentSchema>;
type VideoInputContent = z.infer<typeof VideoInputContentSchema>;
type DocumentInputContent = z.infer<typeof DocumentInputContentSchema>;
type ImageInputPart = ImageInputContent;
type AudioInputPart = AudioInputContent;
type VideoInputPart = VideoInputContent;
type DocumentInputPart = DocumentInputContent;
type BinaryInputContent = z.infer<typeof BinaryInputContentSchema>;
type InputContent = z.infer<typeof InputContentSchema>;
type InputContentPart = z.infer<typeof InputContentSchema>;
type DeveloperMessage = z.infer<typeof DeveloperMessageSchema>;
type SystemMessage = z.infer<typeof SystemMessageSchema>;
type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
type UserMessage = z.infer<typeof UserMessageSchema>;
type ToolMessage = z.infer<typeof ToolMessageSchema>;
type ActivityMessage = z.infer<typeof ActivityMessageSchema>;
type ReasoningMessage = z.infer<typeof ReasoningMessageSchema>;
type Message = z.infer<typeof MessageSchema>;
type Context = z.infer<typeof ContextSchema>;
type Tool = z.infer<typeof ToolSchema>;
type RunAgentInput = z.infer<typeof RunAgentInputSchema>;
type State = z.infer<typeof StateSchema>;
type Role = z.infer<typeof RoleSchema>;
type Interrupt = z.infer<typeof InterruptSchema>;
type ResumeEntry = z.infer<typeof ResumeEntrySchema>;
type ResumeStatus = z.infer<typeof ResumeEntrySchema>["status"];
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
 * One consequence worth knowing: `z.record` drops an own `__proto__` key, which
 * is its prototype-pollution guard. Preserving it would need null-prototype
 * objects throughout parsing and protobuf conversion, handing every consumer
 * objects where `hasOwnProperty` throws — a real cost for a key that is
 * essentially only ever an attack probe. Python keeps it; TypeScript does not.
 */
declare const MetadataSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
type Metadata = z.infer<typeof MetadataSchema>;
/**
 * How metadata is declared on events and messages.
 *
 * The object itself is absent or an object, never `null` — and parsing
 * enforces that invariant rather than coercing a `null` to absent.
 *
 * This is deliberately NOT the treatment `parentMessageId` and `outcome`
 * receive in `events.ts`. Those tolerate `null` because released producers
 * emitted it before the producer-side omission fix, and rejecting it would
 * break agents already in the wild. Metadata has no such history: it postdates
 * the fix that makes every official producer omit fields with no value, and no
 * released Python or .NET package has ever emitted `"metadata": null`. Adding
 * a tolerance here would grandfather in a fourth exception with nobody to
 * protect; enforcing from day one means there is never anything to retire.
 *
 * A `null` *value under a key* is meaningful data and is preserved. Only a
 * `null` in place of the whole object is a contract violation.
 */
declare const OptionalMetadataSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
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
//#region src/capabilities.d.ts
/** Describes a sub-agent that can be invoked by a parent agent. */
declare const SubAgentInfoSchema: z.ZodObject<{
  /** Unique name or identifier of the sub-agent. */name: z.ZodString; /** What this sub-agent specializes in. Helps clients build agent selection UIs. */
  description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
  name: string;
  description?: string | undefined;
}, {
  name: string;
  description?: string | undefined;
}>;
/**
 * Basic metadata about the agent. Useful for discovery UIs, agent marketplaces,
 * and debugging. Set these when you want clients to display agent information
 * or when multiple agents are available and users need to pick one.
 */
declare const IdentityCapabilitiesSchema: z.ZodObject<{
  /** Human-readable name shown in UIs and agent selectors. */name: z.ZodOptional<z.ZodString>; /** The framework or platform powering this agent (e.g., "langgraph", "mastra", "crewai"). */
  type: z.ZodOptional<z.ZodString>; /** What this agent does — helps users and routing logic decide when to use it. */
  description: z.ZodOptional<z.ZodString>; /** Semantic version of the agent (e.g., "1.2.0"). Useful for compatibility checks. */
  version: z.ZodOptional<z.ZodString>; /** Organization or team that maintains this agent. */
  provider: z.ZodOptional<z.ZodString>; /** URL to the agent's documentation or homepage. */
  documentationUrl: z.ZodOptional<z.ZodString>; /** Arbitrary key-value pairs for integration-specific identity info. */
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
  name?: string | undefined;
  type?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
  description?: string | undefined;
  version?: string | undefined;
  provider?: string | undefined;
  documentationUrl?: string | undefined;
}, {
  name?: string | undefined;
  type?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
  description?: string | undefined;
  version?: string | undefined;
  provider?: string | undefined;
  documentationUrl?: string | undefined;
}>;
/**
 * Declares which transport mechanisms the agent supports. Clients use this
 * to pick the best connection strategy. Only set flags to `true` for transports
 * your agent actually handles — omit or set `false` for unsupported ones.
 */
declare const TransportCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent streams responses via SSE. Most agents enable this. */streaming: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent accepts persistent WebSocket connections. */
  websocket: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent supports the AG-UI binary protocol (protobuf over HTTP). */
  httpBinary: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can send async updates via webhooks after a run finishes. */
  pushNotifications: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent supports resuming interrupted streams via sequence numbers. */
  resumable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  streaming?: boolean | undefined;
  websocket?: boolean | undefined;
  httpBinary?: boolean | undefined;
  pushNotifications?: boolean | undefined;
  resumable?: boolean | undefined;
}, {
  streaming?: boolean | undefined;
  websocket?: boolean | undefined;
  httpBinary?: boolean | undefined;
  pushNotifications?: boolean | undefined;
  resumable?: boolean | undefined;
}>;
/**
 * Tool calling capabilities. Distinguishes between tools the agent itself provides
 * (listed in `items`) and tools the client passes at runtime via `RunAgentInput.tools`.
 * Enable this when your agent can call functions, search the web, execute code, etc.
 */
declare const ToolsCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent can make tool calls at all. Set `false` to explicitly
   *  signal tool calling is disabled even if items are present. */
  supported: z.ZodOptional<z.ZodBoolean>;
  /** The tools this agent provides on its own (full JSON Schema definitions).
   *  These are distinct from client-provided tools passed in `RunAgentInput.tools`. */
  items: z.ZodOptional<z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    parameters: z.ZodAny;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }>, "many">>; /** Set `true` if the agent can invoke multiple tools concurrently within a single step. */
  parallelCalls: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent accepts and uses tools provided by the client at runtime. */
  clientProvided: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  supported?: boolean | undefined;
  items?: {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }[] | undefined;
  parallelCalls?: boolean | undefined;
  clientProvided?: boolean | undefined;
}, {
  supported?: boolean | undefined;
  items?: {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    parameters?: any;
  }[] | undefined;
  parallelCalls?: boolean | undefined;
  clientProvided?: boolean | undefined;
}>;
/**
 * Output format support. Enable `structuredOutput` when your agent can return
 * responses conforming to a JSON schema, which is useful for programmatic consumption.
 */
declare const OutputCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent can produce structured JSON output matching a provided schema. */structuredOutput: z.ZodOptional<z.ZodBoolean>;
  /** MIME types the agent can produce (e.g., `["text/plain", "application/json"]`).
   *  Omit if the agent only produces plain text. */
  supportedMimeTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
  structuredOutput?: boolean | undefined;
  supportedMimeTypes?: string[] | undefined;
}, {
  structuredOutput?: boolean | undefined;
  supportedMimeTypes?: string[] | undefined;
}>;
/**
 * State and memory management capabilities. These tell the client how the agent
 * handles shared state and whether conversation context persists across runs.
 */
declare const StateCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent emits `STATE_SNAPSHOT` events (full state replacement). */snapshots: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent emits `STATE_DELTA` events (JSON Patch incremental updates). */
  deltas: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if the agent has long-term memory beyond the current thread
   *  (e.g., vector store, knowledge base, or cross-session recall). */
  memory: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if state is preserved across multiple runs within the same thread.
   *  When `false`, state resets on each run. */
  persistentState: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  snapshots?: boolean | undefined;
  deltas?: boolean | undefined;
  memory?: boolean | undefined;
  persistentState?: boolean | undefined;
}, {
  snapshots?: boolean | undefined;
  deltas?: boolean | undefined;
  memory?: boolean | undefined;
  persistentState?: boolean | undefined;
}>;
/**
 * Multi-agent coordination capabilities. Enable these when your agent can
 * orchestrate or hand off work to other agents.
 */
declare const MultiAgentCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent participates in any form of multi-agent coordination. */supported: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can delegate subtasks to other agents while retaining control. */
  delegation: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can transfer the conversation entirely to another agent. */
  handoffs: z.ZodOptional<z.ZodBoolean>; /** List of sub-agents this agent can invoke. Helps clients build agent selection UIs. */
  subAgents: z.ZodOptional<z.ZodArray<z.ZodObject<{
    /** Unique name or identifier of the sub-agent. */name: z.ZodString; /** What this sub-agent specializes in. Helps clients build agent selection UIs. */
    description: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
  }, {
    name: string;
    description?: string | undefined;
  }>, "many">>;
}, "strip", z.ZodTypeAny, {
  supported?: boolean | undefined;
  delegation?: boolean | undefined;
  handoffs?: boolean | undefined;
  subAgents?: {
    name: string;
    description?: string | undefined;
  }[] | undefined;
}, {
  supported?: boolean | undefined;
  delegation?: boolean | undefined;
  handoffs?: boolean | undefined;
  subAgents?: {
    name: string;
    description?: string | undefined;
  }[] | undefined;
}>;
/**
 * Reasoning and thinking capabilities. Enable these when your agent exposes its
 * internal thought process (e.g., chain-of-thought, extended thinking).
 */
declare const ReasoningCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent produces reasoning/thinking tokens visible to the client. */supported: z.ZodOptional<z.ZodBoolean>; /** Set `true` if reasoning tokens are streamed incrementally (vs. returned all at once). */
  streaming: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if reasoning content is encrypted (zero-data-retention mode).
   *  Clients should expect opaque `encryptedValue` fields instead of readable content. */
  encrypted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  streaming?: boolean | undefined;
  supported?: boolean | undefined;
  encrypted?: boolean | undefined;
}, {
  streaming?: boolean | undefined;
  supported?: boolean | undefined;
  encrypted?: boolean | undefined;
}>;
/**
 * Modalities the agent can accept as input. Clients use this to show/hide
 * file upload buttons, audio recorders, image pickers, etc.
 */
declare const MultimodalInputCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent can process image inputs (e.g., screenshots, photos). */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process audio inputs (speech, recordings). */
  audio: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process video inputs. */
  video: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process PDF documents. */
  pdf: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process arbitrary file uploads. */
  file: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  image?: boolean | undefined;
  audio?: boolean | undefined;
  video?: boolean | undefined;
  pdf?: boolean | undefined;
  file?: boolean | undefined;
}, {
  image?: boolean | undefined;
  audio?: boolean | undefined;
  video?: boolean | undefined;
  pdf?: boolean | undefined;
  file?: boolean | undefined;
}>;
/**
 * Modalities the agent can produce as output. Clients use this to anticipate
 * rich content in the agent's response.
 */
declare const MultimodalOutputCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent can generate images as part of its response. */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can produce audio output (text-to-speech, audio files). */
  audio: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  image?: boolean | undefined;
  audio?: boolean | undefined;
}, {
  image?: boolean | undefined;
  audio?: boolean | undefined;
}>;
/**
 * Multimodal input and output support. Organized into `input` and `output`
 * sub-objects so clients can independently query what the agent accepts
 * versus what it produces.
 */
declare const MultimodalCapabilitiesSchema: z.ZodObject<{
  /** Modalities the agent can accept as input (images, audio, video, PDFs, files). */input: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent can process image inputs (e.g., screenshots, photos). */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process audio inputs (speech, recordings). */
    audio: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process video inputs. */
    video: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process PDF documents. */
    pdf: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process arbitrary file uploads. */
    file: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    image?: boolean | undefined;
    audio?: boolean | undefined;
    video?: boolean | undefined;
    pdf?: boolean | undefined;
    file?: boolean | undefined;
  }, {
    image?: boolean | undefined;
    audio?: boolean | undefined;
    video?: boolean | undefined;
    pdf?: boolean | undefined;
    file?: boolean | undefined;
  }>>; /** Modalities the agent can produce as output (images, audio). */
  output: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent can generate images as part of its response. */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can produce audio output (text-to-speech, audio files). */
    audio: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    image?: boolean | undefined;
    audio?: boolean | undefined;
  }, {
    image?: boolean | undefined;
    audio?: boolean | undefined;
  }>>;
}, "strip", z.ZodTypeAny, {
  input?: {
    image?: boolean | undefined;
    audio?: boolean | undefined;
    video?: boolean | undefined;
    pdf?: boolean | undefined;
    file?: boolean | undefined;
  } | undefined;
  output?: {
    image?: boolean | undefined;
    audio?: boolean | undefined;
  } | undefined;
}, {
  input?: {
    image?: boolean | undefined;
    audio?: boolean | undefined;
    video?: boolean | undefined;
    pdf?: boolean | undefined;
    file?: boolean | undefined;
  } | undefined;
  output?: {
    image?: boolean | undefined;
    audio?: boolean | undefined;
  } | undefined;
}>;
/**
 * Execution control and limits. Declare these so clients can set expectations
 * about how long or how many steps an agent run might take.
 */
declare const ExecutionCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent can execute code (e.g., Python, JavaScript) during a run. */codeExecution: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if code execution happens in a sandboxed/isolated environment.
   *  Only meaningful when `codeExecution` is `true`. */
  sandboxed: z.ZodOptional<z.ZodBoolean>;
  /** Maximum number of tool-call/reasoning iterations the agent will perform per run.
   *  Helps clients display progress or set timeout expectations. */
  maxIterations: z.ZodOptional<z.ZodNumber>; /** Maximum wall-clock time (in milliseconds) the agent will run before timing out. */
  maxExecutionTime: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  codeExecution?: boolean | undefined;
  sandboxed?: boolean | undefined;
  maxIterations?: number | undefined;
  maxExecutionTime?: number | undefined;
}, {
  codeExecution?: boolean | undefined;
  sandboxed?: boolean | undefined;
  maxIterations?: number | undefined;
  maxExecutionTime?: number | undefined;
}>;
/**
 * Human-in-the-loop interaction support. Enable these when your agent can pause
 * execution to request human input, approval, or feedback before continuing.
 */
declare const HumanInTheLoopCapabilitiesSchema: z.ZodObject<{
  /** Set `true` if the agent supports any form of human-in-the-loop interaction. */supported: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if the agent can pause and request explicit approval before
   *  performing sensitive actions (e.g., sending emails, deleting data). */
  approvals: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent allows humans to intervene and modify its plan mid-execution. */
  interventions: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if the agent can incorporate user feedback (thumbs up/down, corrections)
   *  to improve its behavior within the current session. */
  feedback: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if the agent participates in the AG-UI interrupt protocol
   *  (emits RUN_FINISHED with outcome={ type: "interrupt", interrupts: [...] },
   *  accepts resume[]). */
  interrupts: z.ZodOptional<z.ZodBoolean>;
  /** Set `true` if tool-call interrupts accept editedArgs in the resume payload.
   *  Only meaningful when interrupts is true. */
  approveWithEdits: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
  supported?: boolean | undefined;
  approvals?: boolean | undefined;
  interventions?: boolean | undefined;
  feedback?: boolean | undefined;
  interrupts?: boolean | undefined;
  approveWithEdits?: boolean | undefined;
}, {
  supported?: boolean | undefined;
  approvals?: boolean | undefined;
  interventions?: boolean | undefined;
  feedback?: boolean | undefined;
  interrupts?: boolean | undefined;
  approveWithEdits?: boolean | undefined;
}>;
/**
 * A typed, categorized snapshot of an agent's current capabilities.
 * Returned by `getCapabilities()` on `AbstractAgent`.
 *
 * All fields are optional — agents only declare what they support.
 * Omitted fields mean the capability is not declared (unknown), not that
 * it's unsupported.
 *
 * The `custom` field is an escape hatch for integration-specific capabilities
 * that don't fit into the standard categories.
 */
declare const AgentCapabilitiesSchema: z.ZodObject<{
  /** Agent identity and metadata. */identity: z.ZodOptional<z.ZodObject<{
    /** Human-readable name shown in UIs and agent selectors. */name: z.ZodOptional<z.ZodString>; /** The framework or platform powering this agent (e.g., "langgraph", "mastra", "crewai"). */
    type: z.ZodOptional<z.ZodString>; /** What this agent does — helps users and routing logic decide when to use it. */
    description: z.ZodOptional<z.ZodString>; /** Semantic version of the agent (e.g., "1.2.0"). Useful for compatibility checks. */
    version: z.ZodOptional<z.ZodString>; /** Organization or team that maintains this agent. */
    provider: z.ZodOptional<z.ZodString>; /** URL to the agent's documentation or homepage. */
    documentationUrl: z.ZodOptional<z.ZodString>; /** Arbitrary key-value pairs for integration-specific identity info. */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    type?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    version?: string | undefined;
    provider?: string | undefined;
    documentationUrl?: string | undefined;
  }, {
    name?: string | undefined;
    type?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    version?: string | undefined;
    provider?: string | undefined;
    documentationUrl?: string | undefined;
  }>>; /** Supported transport mechanisms (SSE, WebSocket, binary, etc.). */
  transport: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent streams responses via SSE. Most agents enable this. */streaming: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent accepts persistent WebSocket connections. */
    websocket: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent supports the AG-UI binary protocol (protobuf over HTTP). */
    httpBinary: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can send async updates via webhooks after a run finishes. */
    pushNotifications: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent supports resuming interrupted streams via sequence numbers. */
    resumable: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    streaming?: boolean | undefined;
    websocket?: boolean | undefined;
    httpBinary?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    resumable?: boolean | undefined;
  }, {
    streaming?: boolean | undefined;
    websocket?: boolean | undefined;
    httpBinary?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    resumable?: boolean | undefined;
  }>>; /** Tools the agent provides and tool calling configuration. */
  tools: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent can make tool calls at all. Set `false` to explicitly
     *  signal tool calling is disabled even if items are present. */
    supported: z.ZodOptional<z.ZodBoolean>;
    /** The tools this agent provides on its own (full JSON Schema definitions).
     *  These are distinct from client-provided tools passed in `RunAgentInput.tools`. */
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">>; /** Set `true` if the agent can invoke multiple tools concurrently within a single step. */
    parallelCalls: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent accepts and uses tools provided by the client at runtime. */
    clientProvided: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    supported?: boolean | undefined;
    items?: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[] | undefined;
    parallelCalls?: boolean | undefined;
    clientProvided?: boolean | undefined;
  }, {
    supported?: boolean | undefined;
    items?: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[] | undefined;
    parallelCalls?: boolean | undefined;
    clientProvided?: boolean | undefined;
  }>>; /** Output format support (structured output, MIME types). */
  output: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent can produce structured JSON output matching a provided schema. */structuredOutput: z.ZodOptional<z.ZodBoolean>;
    /** MIME types the agent can produce (e.g., `["text/plain", "application/json"]`).
     *  Omit if the agent only produces plain text. */
    supportedMimeTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strip", z.ZodTypeAny, {
    structuredOutput?: boolean | undefined;
    supportedMimeTypes?: string[] | undefined;
  }, {
    structuredOutput?: boolean | undefined;
    supportedMimeTypes?: string[] | undefined;
  }>>; /** State and memory management (snapshots, deltas, persistence). */
  state: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent emits `STATE_SNAPSHOT` events (full state replacement). */snapshots: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent emits `STATE_DELTA` events (JSON Patch incremental updates). */
    deltas: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if the agent has long-term memory beyond the current thread
     *  (e.g., vector store, knowledge base, or cross-session recall). */
    memory: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if state is preserved across multiple runs within the same thread.
     *  When `false`, state resets on each run. */
    persistentState: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    snapshots?: boolean | undefined;
    deltas?: boolean | undefined;
    memory?: boolean | undefined;
    persistentState?: boolean | undefined;
  }, {
    snapshots?: boolean | undefined;
    deltas?: boolean | undefined;
    memory?: boolean | undefined;
    persistentState?: boolean | undefined;
  }>>; /** Multi-agent coordination (delegation, handoffs, sub-agents). */
  multiAgent: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent participates in any form of multi-agent coordination. */supported: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can delegate subtasks to other agents while retaining control. */
    delegation: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can transfer the conversation entirely to another agent. */
    handoffs: z.ZodOptional<z.ZodBoolean>; /** List of sub-agents this agent can invoke. Helps clients build agent selection UIs. */
    subAgents: z.ZodOptional<z.ZodArray<z.ZodObject<{
      /** Unique name or identifier of the sub-agent. */name: z.ZodString; /** What this sub-agent specializes in. Helps clients build agent selection UIs. */
      description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description?: string | undefined;
    }, {
      name: string;
      description?: string | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    supported?: boolean | undefined;
    delegation?: boolean | undefined;
    handoffs?: boolean | undefined;
    subAgents?: {
      name: string;
      description?: string | undefined;
    }[] | undefined;
  }, {
    supported?: boolean | undefined;
    delegation?: boolean | undefined;
    handoffs?: boolean | undefined;
    subAgents?: {
      name: string;
      description?: string | undefined;
    }[] | undefined;
  }>>; /** Reasoning and thinking support (chain-of-thought, encrypted thinking). */
  reasoning: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent produces reasoning/thinking tokens visible to the client. */supported: z.ZodOptional<z.ZodBoolean>; /** Set `true` if reasoning tokens are streamed incrementally (vs. returned all at once). */
    streaming: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if reasoning content is encrypted (zero-data-retention mode).
     *  Clients should expect opaque `encryptedValue` fields instead of readable content. */
    encrypted: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    streaming?: boolean | undefined;
    supported?: boolean | undefined;
    encrypted?: boolean | undefined;
  }, {
    streaming?: boolean | undefined;
    supported?: boolean | undefined;
    encrypted?: boolean | undefined;
  }>>; /** Multimodal input/output support (images, audio, video, files). */
  multimodal: z.ZodOptional<z.ZodObject<{
    /** Modalities the agent can accept as input (images, audio, video, PDFs, files). */input: z.ZodOptional<z.ZodObject<{
      /** Set `true` if the agent can process image inputs (e.g., screenshots, photos). */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process audio inputs (speech, recordings). */
      audio: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process video inputs. */
      video: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process PDF documents. */
      pdf: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can process arbitrary file uploads. */
      file: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    }, {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    }>>; /** Modalities the agent can produce as output (images, audio). */
    output: z.ZodOptional<z.ZodObject<{
      /** Set `true` if the agent can generate images as part of its response. */image: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent can produce audio output (text-to-speech, audio files). */
      audio: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    }, {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    }>>;
  }, "strip", z.ZodTypeAny, {
    input?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    } | undefined;
    output?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    } | undefined;
  }, {
    input?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    } | undefined;
    output?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    } | undefined;
  }>>; /** Execution control and limits (code execution, timeouts, iteration caps). */
  execution: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent can execute code (e.g., Python, JavaScript) during a run. */codeExecution: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if code execution happens in a sandboxed/isolated environment.
     *  Only meaningful when `codeExecution` is `true`. */
    sandboxed: z.ZodOptional<z.ZodBoolean>;
    /** Maximum number of tool-call/reasoning iterations the agent will perform per run.
     *  Helps clients display progress or set timeout expectations. */
    maxIterations: z.ZodOptional<z.ZodNumber>; /** Maximum wall-clock time (in milliseconds) the agent will run before timing out. */
    maxExecutionTime: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    codeExecution?: boolean | undefined;
    sandboxed?: boolean | undefined;
    maxIterations?: number | undefined;
    maxExecutionTime?: number | undefined;
  }, {
    codeExecution?: boolean | undefined;
    sandboxed?: boolean | undefined;
    maxIterations?: number | undefined;
    maxExecutionTime?: number | undefined;
  }>>; /** Human-in-the-loop support (approvals, interventions, feedback). */
  humanInTheLoop: z.ZodOptional<z.ZodObject<{
    /** Set `true` if the agent supports any form of human-in-the-loop interaction. */supported: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if the agent can pause and request explicit approval before
     *  performing sensitive actions (e.g., sending emails, deleting data). */
    approvals: z.ZodOptional<z.ZodBoolean>; /** Set `true` if the agent allows humans to intervene and modify its plan mid-execution. */
    interventions: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if the agent can incorporate user feedback (thumbs up/down, corrections)
     *  to improve its behavior within the current session. */
    feedback: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if the agent participates in the AG-UI interrupt protocol
     *  (emits RUN_FINISHED with outcome={ type: "interrupt", interrupts: [...] },
     *  accepts resume[]). */
    interrupts: z.ZodOptional<z.ZodBoolean>;
    /** Set `true` if tool-call interrupts accept editedArgs in the resume payload.
     *  Only meaningful when interrupts is true. */
    approveWithEdits: z.ZodOptional<z.ZodBoolean>;
  }, "strip", z.ZodTypeAny, {
    supported?: boolean | undefined;
    approvals?: boolean | undefined;
    interventions?: boolean | undefined;
    feedback?: boolean | undefined;
    interrupts?: boolean | undefined;
    approveWithEdits?: boolean | undefined;
  }, {
    supported?: boolean | undefined;
    approvals?: boolean | undefined;
    interventions?: boolean | undefined;
    feedback?: boolean | undefined;
    interrupts?: boolean | undefined;
    approveWithEdits?: boolean | undefined;
  }>>; /** Integration-specific capabilities not covered by the standard categories. */
  custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
  custom?: Record<string, unknown> | undefined;
  reasoning?: {
    streaming?: boolean | undefined;
    supported?: boolean | undefined;
    encrypted?: boolean | undefined;
  } | undefined;
  state?: {
    snapshots?: boolean | undefined;
    deltas?: boolean | undefined;
    memory?: boolean | undefined;
    persistentState?: boolean | undefined;
  } | undefined;
  tools?: {
    supported?: boolean | undefined;
    items?: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[] | undefined;
    parallelCalls?: boolean | undefined;
    clientProvided?: boolean | undefined;
  } | undefined;
  output?: {
    structuredOutput?: boolean | undefined;
    supportedMimeTypes?: string[] | undefined;
  } | undefined;
  identity?: {
    name?: string | undefined;
    type?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    version?: string | undefined;
    provider?: string | undefined;
    documentationUrl?: string | undefined;
  } | undefined;
  transport?: {
    streaming?: boolean | undefined;
    websocket?: boolean | undefined;
    httpBinary?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    resumable?: boolean | undefined;
  } | undefined;
  multiAgent?: {
    supported?: boolean | undefined;
    delegation?: boolean | undefined;
    handoffs?: boolean | undefined;
    subAgents?: {
      name: string;
      description?: string | undefined;
    }[] | undefined;
  } | undefined;
  multimodal?: {
    input?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    } | undefined;
    output?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    } | undefined;
  } | undefined;
  execution?: {
    codeExecution?: boolean | undefined;
    sandboxed?: boolean | undefined;
    maxIterations?: number | undefined;
    maxExecutionTime?: number | undefined;
  } | undefined;
  humanInTheLoop?: {
    supported?: boolean | undefined;
    approvals?: boolean | undefined;
    interventions?: boolean | undefined;
    feedback?: boolean | undefined;
    interrupts?: boolean | undefined;
    approveWithEdits?: boolean | undefined;
  } | undefined;
}, {
  custom?: Record<string, unknown> | undefined;
  reasoning?: {
    streaming?: boolean | undefined;
    supported?: boolean | undefined;
    encrypted?: boolean | undefined;
  } | undefined;
  state?: {
    snapshots?: boolean | undefined;
    deltas?: boolean | undefined;
    memory?: boolean | undefined;
    persistentState?: boolean | undefined;
  } | undefined;
  tools?: {
    supported?: boolean | undefined;
    items?: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[] | undefined;
    parallelCalls?: boolean | undefined;
    clientProvided?: boolean | undefined;
  } | undefined;
  output?: {
    structuredOutput?: boolean | undefined;
    supportedMimeTypes?: string[] | undefined;
  } | undefined;
  identity?: {
    name?: string | undefined;
    type?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    version?: string | undefined;
    provider?: string | undefined;
    documentationUrl?: string | undefined;
  } | undefined;
  transport?: {
    streaming?: boolean | undefined;
    websocket?: boolean | undefined;
    httpBinary?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    resumable?: boolean | undefined;
  } | undefined;
  multiAgent?: {
    supported?: boolean | undefined;
    delegation?: boolean | undefined;
    handoffs?: boolean | undefined;
    subAgents?: {
      name: string;
      description?: string | undefined;
    }[] | undefined;
  } | undefined;
  multimodal?: {
    input?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
      video?: boolean | undefined;
      pdf?: boolean | undefined;
      file?: boolean | undefined;
    } | undefined;
    output?: {
      image?: boolean | undefined;
      audio?: boolean | undefined;
    } | undefined;
  } | undefined;
  execution?: {
    codeExecution?: boolean | undefined;
    sandboxed?: boolean | undefined;
    maxIterations?: number | undefined;
    maxExecutionTime?: number | undefined;
  } | undefined;
  humanInTheLoop?: {
    supported?: boolean | undefined;
    approvals?: boolean | undefined;
    interventions?: boolean | undefined;
    feedback?: boolean | undefined;
    interrupts?: boolean | undefined;
    approveWithEdits?: boolean | undefined;
  } | undefined;
}>;
/** Describes a sub-agent that can be invoked by a parent agent. */
type SubAgentInfo = z.infer<typeof SubAgentInfoSchema>;
/** Agent identity and metadata for discovery UIs, marketplaces, and debugging. */
type IdentityCapabilities = z.infer<typeof IdentityCapabilitiesSchema>;
/** Supported transport mechanisms (SSE, WebSocket, binary protocol, push notifications). */
type TransportCapabilities = z.infer<typeof TransportCapabilitiesSchema>;
/** Tool calling support and agent-provided tool definitions. */
type ToolsCapabilities = z.infer<typeof ToolsCapabilitiesSchema>;
/** Output format support (structured output, MIME types). */
type OutputCapabilities = z.infer<typeof OutputCapabilitiesSchema>;
/** State and memory management (snapshots, deltas, persistence, long-term memory). */
type StateCapabilities = z.infer<typeof StateCapabilitiesSchema>;
/** Multi-agent coordination (delegation, handoffs, sub-agent orchestration). */
type MultiAgentCapabilities = z.infer<typeof MultiAgentCapabilitiesSchema>;
/** Reasoning and thinking visibility (streaming, encrypted chain-of-thought). */
type ReasoningCapabilities = z.infer<typeof ReasoningCapabilitiesSchema>;
/** Modalities the agent can accept as input (images, audio, video, PDFs, files). */
type MultimodalInputCapabilities = z.infer<typeof MultimodalInputCapabilitiesSchema>;
/** Modalities the agent can produce as output (images, audio). */
type MultimodalOutputCapabilities = z.infer<typeof MultimodalOutputCapabilitiesSchema>;
/** Multimodal input/output support (images, audio, video, PDFs, file uploads). */
type MultimodalCapabilities = z.infer<typeof MultimodalCapabilitiesSchema>;
/** Execution control and limits (code execution, sandboxing, iteration caps, timeouts). */
type ExecutionCapabilities = z.infer<typeof ExecutionCapabilitiesSchema>;
/** Human-in-the-loop interaction support (approvals, interventions, feedback). */
type HumanInTheLoopCapabilities = z.infer<typeof HumanInTheLoopCapabilitiesSchema>;
/** A typed, categorized snapshot of an agent's current capabilities. Returned by `getCapabilities()`. */
type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;
//#endregion
//#region src/events.d.ts
declare enum EventType {
  TEXT_MESSAGE_START = "TEXT_MESSAGE_START",
  TEXT_MESSAGE_CONTENT = "TEXT_MESSAGE_CONTENT",
  TEXT_MESSAGE_END = "TEXT_MESSAGE_END",
  TEXT_MESSAGE_CHUNK = "TEXT_MESSAGE_CHUNK",
  TOOL_CALL_START = "TOOL_CALL_START",
  TOOL_CALL_ARGS = "TOOL_CALL_ARGS",
  TOOL_CALL_END = "TOOL_CALL_END",
  TOOL_CALL_CHUNK = "TOOL_CALL_CHUNK",
  TOOL_CALL_RESULT = "TOOL_CALL_RESULT",
  /**
   * @deprecated Use REASONING_START instead. Will be removed in 1.0.0.
   */
  THINKING_START = "THINKING_START",
  /**
   * @deprecated Use REASONING_END instead. Will be removed in 1.0.0.
   */
  THINKING_END = "THINKING_END",
  /**
   * @deprecated Use REASONING_MESSAGE_START instead. Will be removed in 1.0.0.
   */
  THINKING_TEXT_MESSAGE_START = "THINKING_TEXT_MESSAGE_START",
  /**
   * @deprecated Use REASONING_MESSAGE_CONTENT instead. Will be removed in 1.0.0.
   */
  THINKING_TEXT_MESSAGE_CONTENT = "THINKING_TEXT_MESSAGE_CONTENT",
  /**
   * @deprecated Use REASONING_MESSAGE_END instead. Will be removed in 1.0.0.
   */
  THINKING_TEXT_MESSAGE_END = "THINKING_TEXT_MESSAGE_END",
  STATE_SNAPSHOT = "STATE_SNAPSHOT",
  STATE_DELTA = "STATE_DELTA",
  MESSAGES_SNAPSHOT = "MESSAGES_SNAPSHOT",
  ACTIVITY_SNAPSHOT = "ACTIVITY_SNAPSHOT",
  ACTIVITY_DELTA = "ACTIVITY_DELTA",
  RAW = "RAW",
  CUSTOM = "CUSTOM",
  RUN_STARTED = "RUN_STARTED",
  RUN_FINISHED = "RUN_FINISHED",
  RUN_ERROR = "RUN_ERROR",
  STEP_STARTED = "STEP_STARTED",
  STEP_FINISHED = "STEP_FINISHED",
  REASONING_START = "REASONING_START",
  REASONING_MESSAGE_START = "REASONING_MESSAGE_START",
  REASONING_MESSAGE_CONTENT = "REASONING_MESSAGE_CONTENT",
  REASONING_MESSAGE_END = "REASONING_MESSAGE_END",
  REASONING_MESSAGE_CHUNK = "REASONING_MESSAGE_CHUNK",
  REASONING_END = "REASONING_END",
  REASONING_ENCRYPTED_VALUE = "REASONING_ENCRYPTED_VALUE",
  SUBAGENT_STARTED = "SUBAGENT_STARTED",
  SUBAGENT_FINISHED = "SUBAGENT_FINISHED",
  SUBAGENT_ERROR = "SUBAGENT_ERROR"
}
declare const BaseEventSchema: z.ZodObject<{
  type: z.ZodNativeEnum<typeof EventType>;
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  type: z.ZodNativeEnum<typeof EventType>;
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  type: z.ZodNativeEnum<typeof EventType>;
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.ZodTypeAny, "passthrough">>;
declare const TextMessageStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const TextMessageContentEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const TextMessageEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const TextMessageChunkEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * @deprecated Use ReasoningMessageStartEventSchema instead. Will be removed in 1.0.0.
 */
declare const ThinkingTextMessageStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * @deprecated Use ReasoningMessageContentEventSchema instead. Will be removed in 1.0.0.
 */
declare const ThinkingTextMessageContentEventSchema: z.ZodObject<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * @deprecated Use ReasoningMessageEndEventSchema instead. Will be removed in 1.0.0.
 */
declare const ThinkingTextMessageEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, z.ZodTypeAny, "passthrough">>;
declare const ToolCallStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ToolCallArgsEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ToolCallEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ToolCallResultEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ToolCallChunkEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * @deprecated Use ReasoningStartEventSchema instead. Will be removed in 1.0.0.
 */
declare const ThinkingStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * @deprecated Use ReasoningEndEventSchema instead. Will be removed in 1.0.0.
 */
declare const ThinkingEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, z.ZodTypeAny, "passthrough">>;
declare const StateSnapshotEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const StateDeltaEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const MessagesSnapshotEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, z.ZodTypeAny, "passthrough">>;
declare const ActivitySnapshotEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ActivityDeltaEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const RawEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const CustomEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const RunStartedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, z.ZodTypeAny, "passthrough">>;
declare const RunFinishedSuccessOutcomeSchema: z.ZodObject<{
  type: z.ZodLiteral<"success">;
}, "strict", z.ZodTypeAny, {
  type: "success";
}, {
  type: "success";
}>;
declare const RunFinishedInterruptOutcomeSchema: z.ZodObject<{
  type: z.ZodLiteral<"interrupt">;
  interrupts: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    expiresAt: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    subagentRunId: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }, {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }>, "many">;
}, "strict", z.ZodTypeAny, {
  type: "interrupt";
  interrupts: {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }[];
}, {
  type: "interrupt";
  interrupts: {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }[];
}>;
declare const RunFinishedOutcomeSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
  type: z.ZodLiteral<"success">;
}, "strict", z.ZodTypeAny, {
  type: "success";
}, {
  type: "success";
}>, z.ZodObject<{
  type: z.ZodLiteral<"interrupt">;
  interrupts: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    expiresAt: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    subagentRunId: z.ZodOptional<z.ZodString>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }, {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }>, "many">;
}, "strict", z.ZodTypeAny, {
  type: "interrupt";
  interrupts: {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }[];
}, {
  type: "interrupt";
  interrupts: {
    id: string;
    reason: string;
    message?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    toolCallId?: string | undefined;
    responseSchema?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
  }[];
}>]>;
declare const TokenUsageSchema: z.ZodObject<{
  provider: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodString>;
  inputTokens: z.ZodOptional<z.ZodNumber>;
  outputTokens: z.ZodOptional<z.ZodNumber>;
  totalTokens: z.ZodOptional<z.ZodNumber>;
  reasoningTokens: z.ZodOptional<z.ZodNumber>;
  cachedInputTokens: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
  provider?: string | undefined;
  model?: string | undefined;
  inputTokens?: number | undefined;
  outputTokens?: number | undefined;
  totalTokens?: number | undefined;
  reasoningTokens?: number | undefined;
  cachedInputTokens?: number | undefined;
}, {
  provider?: string | undefined;
  model?: string | undefined;
  inputTokens?: number | undefined;
  outputTokens?: number | undefined;
  totalTokens?: number | undefined;
  reasoningTokens?: number | undefined;
  cachedInputTokens?: number | undefined;
}>;
declare const RunFinishedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
declare const RunErrorEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
declare const StepStartedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const StepFinishedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningEncryptedValueSubtypeSchema: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
declare const ReasoningStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningMessageStartEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningMessageContentEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningMessageEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningMessageChunkEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningEndEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const ReasoningEncryptedValueEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const SubagentStartedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const SubagentFinishedSuccessOutcomeSchema: z.ZodObject<{
  type: z.ZodLiteral<"success">;
}, "strict", z.ZodTypeAny, {
  type: "success";
}, {
  type: "success";
}>;
declare const SubagentFinishedSuspendedOutcomeSchema: z.ZodObject<{
  type: z.ZodLiteral<"suspended">;
  interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
  type: "suspended";
  interruptIds?: string[] | undefined;
}, {
  type: "suspended";
  interruptIds?: string[] | undefined;
}>;
declare const SubagentFinishedOutcomeSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
  type: z.ZodLiteral<"success">;
}, "strict", z.ZodTypeAny, {
  type: "success";
}, {
  type: "success";
}>, z.ZodObject<{
  type: z.ZodLiteral<"suspended">;
  interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
  type: "suspended";
  interruptIds?: string[] | undefined;
}, {
  type: "suspended";
  interruptIds?: string[] | undefined;
}>]>;
declare const SubagentFinishedEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, z.ZodTypeAny, "passthrough">>;
declare const SubagentErrorEventSchema: z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
declare const EventSchemas: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  role: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"developer">, z.ZodLiteral<"system">, z.ZodLiteral<"assistant">, z.ZodLiteral<"user">]>>;
  delta: z.ZodOptional<z.ZodString>;
  name: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_START>;
  title: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_END>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_START>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<Omit<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TEXT_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "type" | "subagentRunId" | "messageId"> & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_CONTENT>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.THINKING_TEXT_MESSAGE_END>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_START>;
  toolCallId: z.ZodString;
  toolCallName: z.ZodString;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_ARGS>;
  toolCallId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_END>;
  toolCallId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.TOOL_CALL_CHUNK>;
  toolCallId: z.ZodOptional<z.ZodString>;
  toolCallName: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string | undefined, string | null | undefined>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  messageId: z.ZodString;
  type: z.ZodLiteral<EventType.TOOL_CALL_RESULT>;
  toolCallId: z.ZodString;
  content: z.ZodString;
  role: z.ZodOptional<z.ZodLiteral<"tool">>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_SNAPSHOT>;
  snapshot: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STATE_DELTA>;
  delta: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.MESSAGES_SNAPSHOT>;
  messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"developer">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "developer";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "system";
    content: string;
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"assistant">;
    content: z.ZodOptional<z.ZodString>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      type: z.ZodLiteral<"function">;
      function: z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        name: string;
        arguments: string;
      }, {
        name: string;
        arguments: string;
      }>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }, {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }, {
    id: string;
    role: "assistant";
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    content?: string | undefined;
    subagentRunId?: string | undefined;
    toolCalls?: {
      function: {
        name: string;
        arguments: string;
      };
      type: "function";
      id: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
    }[] | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  } & {
    role: z.ZodLiteral<"user">;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      type: "text";
      text: string;
    }, {
      type: "text";
      text: string;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"video">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"document">;
      source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"data">;
        value: z.ZodString;
        mimeType: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "data";
        mimeType: string;
      }, {
        value: string;
        type: "data";
        mimeType: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"url">;
        value: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }, {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      }>]>;
      metadata: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }, {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    }>, z.ZodObject<{
      type: z.ZodLiteral<"binary">;
      mimeType: z.ZodString;
      id: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      data: z.ZodOptional<z.ZodString>;
      filename: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>]>, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }, {
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    }>, "many">]>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "user";
    content: string | ({
      type: "text";
      text: string;
    } | {
      type: "image";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "audio";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "video";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "document";
      source: {
        value: string;
        type: "data";
        mimeType: string;
      } | {
        value: string;
        type: "url";
        mimeType?: string | undefined;
      };
      metadata?: unknown;
    } | {
      type: "binary";
      mimeType: string;
      id?: string | undefined;
      data?: string | undefined;
      url?: string | undefined;
      filename?: string | undefined;
    })[];
    name?: string | undefined;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    role: z.ZodLiteral<"tool">;
    toolCallId: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }, {
    id: string;
    role: "tool";
    content: string;
    toolCallId: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
    error?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"activity">;
    activityType: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "activity";
    content: Record<string, any>;
    activityType: string;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>, z.ZodObject<{
    id: z.ZodString;
    role: z.ZodLiteral<"reasoning">;
    content: z.ZodString;
    encryptedValue: z.ZodOptional<z.ZodString>;
    subagentRunId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  }, "strip", z.ZodTypeAny, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }, {
    id: string;
    role: "reasoning";
    content: string;
    encryptedValue?: string | undefined;
    metadata?: Record<string, any> | undefined;
    subagentRunId?: string | undefined;
  }>]>, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_SNAPSHOT>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  content: z.ZodRecord<z.ZodString, z.ZodAny>;
  replace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.ACTIVITY_DELTA>;
  messageId: z.ZodString;
  activityType: z.ZodString;
  patch: z.ZodArray<z.ZodAny, "many">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RAW>;
  event: z.ZodAny;
  source: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.CUSTOM>;
  name: z.ZodString;
  value: z.ZodAny;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_STARTED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  parentRunId: z.ZodOptional<z.ZodString>;
  input: z.ZodOptional<z.ZodObject<{
    threadId: z.ZodString;
    runId: z.ZodString;
    parentRunId: z.ZodOptional<z.ZodString>;
    state: z.ZodEffects<z.ZodAny, any, any>;
    messages: z.ZodArray<z.ZodDiscriminatedUnion<"role", [z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"developer">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"system">;
      content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"assistant">;
      content: z.ZodOptional<z.ZodString>;
      toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"function">;
        function: z.ZodObject<{
          name: z.ZodString;
          arguments: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          name: string;
          arguments: string;
        }, {
          name: string;
          arguments: string;
        }>;
        encryptedValue: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      }, "strip", z.ZodTypeAny, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }, {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }>, "many">>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }, {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    } & {
      role: z.ZodLiteral<"user">;
      content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodEffects<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
      }, "strip", z.ZodTypeAny, {
        type: "text";
        text: string;
      }, {
        type: "text";
        text: string;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"document">;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
          type: z.ZodLiteral<"data">;
          value: z.ZodString;
          mimeType: z.ZodString;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "data";
          mimeType: string;
        }, {
          value: string;
          type: "data";
          mimeType: string;
        }>, z.ZodObject<{
          type: z.ZodLiteral<"url">;
          value: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }, {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        }>]>;
        metadata: z.ZodOptional<z.ZodUnknown>;
      }, "strip", z.ZodTypeAny, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }, {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      }>, z.ZodObject<{
        type: z.ZodLiteral<"binary">;
        mimeType: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodString>;
        filename: z.ZodOptional<z.ZodString>;
      }, "strip", z.ZodTypeAny, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>]>, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }, {
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      }>, "many">]>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      content: z.ZodString;
      role: z.ZodLiteral<"tool">;
      toolCallId: z.ZodString;
      error: z.ZodOptional<z.ZodString>;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }, {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"activity">;
      activityType: z.ZodString;
      content: z.ZodRecord<z.ZodString, z.ZodAny>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>, z.ZodObject<{
      id: z.ZodString;
      role: z.ZodLiteral<"reasoning">;
      content: z.ZodString;
      encryptedValue: z.ZodOptional<z.ZodString>;
      subagentRunId: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }, {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    }>]>, "many">;
    tools: z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodString;
      parameters: z.ZodAny;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }, {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }>, "many">;
    context: z.ZodArray<z.ZodObject<{
      description: z.ZodString;
      value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
      value: string;
      description: string;
    }, {
      value: string;
      description: string;
    }>, "many">;
    forwardedProps: z.ZodAny;
    resume: z.ZodOptional<z.ZodArray<z.ZodObject<{
      interruptId: z.ZodString;
      status: z.ZodEnum<["resolved", "cancelled"]>;
      payload: z.ZodOptional<z.ZodAny>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }, {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }>, "many">>;
  }, "strip", z.ZodTypeAny, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }, {
    threadId: string;
    runId: string;
    messages: ({
      id: string;
      role: "developer";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "system";
      content: string;
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "assistant";
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      content?: string | undefined;
      subagentRunId?: string | undefined;
      toolCalls?: {
        function: {
          name: string;
          arguments: string;
        };
        type: "function";
        id: string;
        encryptedValue?: string | undefined;
        metadata?: Record<string, any> | undefined;
      }[] | undefined;
    } | {
      id: string;
      role: "user";
      content: string | ({
        type: "text";
        text: string;
      } | {
        type: "image";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "audio";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "video";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "document";
        source: {
          value: string;
          type: "data";
          mimeType: string;
        } | {
          value: string;
          type: "url";
          mimeType?: string | undefined;
        };
        metadata?: unknown;
      } | {
        type: "binary";
        mimeType: string;
        id?: string | undefined;
        data?: string | undefined;
        url?: string | undefined;
        filename?: string | undefined;
      })[];
      name?: string | undefined;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "tool";
      content: string;
      toolCallId: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      error?: string | undefined;
    } | {
      id: string;
      role: "activity";
      content: Record<string, any>;
      activityType: string;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    } | {
      id: string;
      role: "reasoning";
      content: string;
      encryptedValue?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
    })[];
    tools: {
      name: string;
      description: string;
      metadata?: Record<string, any> | undefined;
      parameters?: any;
    }[];
    context: {
      value: string;
      description: string;
    }[];
    parentRunId?: string | undefined;
    state?: any;
    forwardedProps?: any;
    resume?: {
      status: "resolved" | "cancelled";
      interruptId: string;
      metadata?: Record<string, any> | undefined;
      payload?: any;
    }[] | undefined;
  }>>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_FINISHED>;
  threadId: z.ZodString;
  runId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"interrupt">;
    interrupts: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      reason: z.ZodString;
      message: z.ZodOptional<z.ZodString>;
      toolCallId: z.ZodOptional<z.ZodString>;
      responseSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      expiresAt: z.ZodOptional<z.ZodString>;
      metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
      subagentRunId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }, {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }>, "many">;
  }, "strict", z.ZodTypeAny, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }, {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  }>]>>>, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | undefined, {
    type: "success";
  } | {
    type: "interrupt";
    interrupts: {
      id: string;
      reason: string;
      message?: string | undefined;
      metadata?: Record<string, any> | undefined;
      subagentRunId?: string | undefined;
      toolCallId?: string | undefined;
      responseSchema?: Record<string, any> | undefined;
      expiresAt?: string | undefined;
    }[];
  } | null | undefined>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.RUN_ERROR>;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
  usage: z.ZodOptional<z.ZodArray<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    reasoningTokens: z.ZodOptional<z.ZodNumber>;
    cachedInputTokens: z.ZodOptional<z.ZodNumber>;
  }, "strip", z.ZodTypeAny, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }, {
    provider?: string | undefined;
    model?: string | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    reasoningTokens?: number | undefined;
    cachedInputTokens?: number | undefined;
  }>, "many">>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_STARTED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.STEP_FINISHED>;
  stepName: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_START>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_START>;
  messageId: z.ZodString;
  role: z.ZodLiteral<"reasoning">;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CONTENT>;
  messageId: z.ZodString;
  delta: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_MESSAGE_CHUNK>;
  messageId: z.ZodOptional<z.ZodString>;
  delta: z.ZodOptional<z.ZodString>;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_END>;
  messageId: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.REASONING_ENCRYPTED_VALUE>;
  subtype: z.ZodUnion<[z.ZodLiteral<"tool-call">, z.ZodLiteral<"message">]>;
  entityId: z.ZodString;
  encryptedValue: z.ZodString;
  subagentRunId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_STARTED>;
  subagentRunId: z.ZodString;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  parentSubagentRunId: z.ZodOptional<z.ZodString>;
  parentToolCallId: z.ZodOptional<z.ZodString>;
  parentMessageId: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_FINISHED>;
  subagentRunId: z.ZodString;
  result: z.ZodOptional<z.ZodAny>;
  outcome: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"success">;
  }, "strict", z.ZodTypeAny, {
    type: "success";
  }, {
    type: "success";
  }>, z.ZodObject<{
    type: z.ZodLiteral<"suspended">;
    interruptIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  }, "strict", z.ZodTypeAny, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }, {
    type: "suspended";
    interruptIds?: string[] | undefined;
  }>]>>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
  timestamp: z.ZodOptional<z.ZodNumber>;
  rawEvent: z.ZodOptional<z.ZodAny>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
} & {
  type: z.ZodLiteral<EventType.SUBAGENT_ERROR>;
  subagentRunId: z.ZodString;
  message: z.ZodString;
  code: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>]>;
type BaseEvent = z.infer<typeof BaseEventSchema>;
type AGUIEvent = z.infer<typeof EventSchemas>;
type BaseEventFields = z.infer<typeof BaseEventSchema>;
type AGUIEventByType = {
  [EventType.TEXT_MESSAGE_START]: TextMessageStartEvent;
  [EventType.TEXT_MESSAGE_CONTENT]: TextMessageContentEvent;
  [EventType.TEXT_MESSAGE_END]: TextMessageEndEvent;
  [EventType.TEXT_MESSAGE_CHUNK]: TextMessageChunkEvent;
  [EventType.THINKING_TEXT_MESSAGE_START]: ThinkingTextMessageStartEvent;
  [EventType.THINKING_TEXT_MESSAGE_CONTENT]: ThinkingTextMessageContentEvent;
  [EventType.THINKING_TEXT_MESSAGE_END]: ThinkingTextMessageEndEvent;
  [EventType.TOOL_CALL_START]: ToolCallStartEvent;
  [EventType.TOOL_CALL_ARGS]: ToolCallArgsEvent;
  [EventType.TOOL_CALL_END]: ToolCallEndEvent;
  [EventType.TOOL_CALL_CHUNK]: ToolCallChunkEvent;
  [EventType.TOOL_CALL_RESULT]: ToolCallResultEvent;
  [EventType.THINKING_START]: ThinkingStartEvent;
  [EventType.THINKING_END]: ThinkingEndEvent;
  [EventType.STATE_SNAPSHOT]: StateSnapshotEvent;
  [EventType.STATE_DELTA]: StateDeltaEvent;
  [EventType.MESSAGES_SNAPSHOT]: MessagesSnapshotEvent;
  [EventType.ACTIVITY_SNAPSHOT]: ActivitySnapshotEvent;
  [EventType.ACTIVITY_DELTA]: ActivityDeltaEvent;
  [EventType.RAW]: RawEvent;
  [EventType.CUSTOM]: CustomEvent;
  [EventType.RUN_STARTED]: RunStartedEvent;
  [EventType.RUN_FINISHED]: RunFinishedEvent;
  [EventType.RUN_ERROR]: RunErrorEvent;
  [EventType.STEP_STARTED]: StepStartedEvent;
  [EventType.STEP_FINISHED]: StepFinishedEvent;
  [EventType.REASONING_START]: ReasoningStartEvent;
  [EventType.REASONING_MESSAGE_START]: ReasoningMessageStartEvent;
  [EventType.REASONING_MESSAGE_CONTENT]: ReasoningMessageContentEvent;
  [EventType.REASONING_MESSAGE_END]: ReasoningMessageEndEvent;
  [EventType.REASONING_MESSAGE_CHUNK]: ReasoningMessageChunkEvent;
  [EventType.REASONING_END]: ReasoningEndEvent;
  [EventType.REASONING_ENCRYPTED_VALUE]: ReasoningEncryptedValueEvent;
  [EventType.SUBAGENT_STARTED]: SubagentStartedEvent;
  [EventType.SUBAGENT_FINISHED]: SubagentFinishedEvent;
  [EventType.SUBAGENT_ERROR]: SubagentErrorEvent;
};
type AGUIEventOf<T extends EventType> = AGUIEventByType[T];
type EventPayloadOf<T extends EventType> = Omit<AGUIEventOf<T>, keyof BaseEventFields>;
type EventProps<Schema extends z.ZodTypeAny> = Omit<z.input<Schema>, "type">;
type BaseEventProps = EventProps<typeof BaseEventSchema>;
type TextMessageStartEventProps = EventProps<typeof TextMessageStartEventSchema>;
type TextMessageContentEventProps = EventProps<typeof TextMessageContentEventSchema>;
type TextMessageEndEventProps = EventProps<typeof TextMessageEndEventSchema>;
type TextMessageChunkEventProps = EventProps<typeof TextMessageChunkEventSchema>;
type ThinkingTextMessageStartEventProps = EventProps<typeof ThinkingTextMessageStartEventSchema>;
type ThinkingTextMessageContentEventProps = EventProps<typeof ThinkingTextMessageContentEventSchema>;
type ThinkingTextMessageEndEventProps = EventProps<typeof ThinkingTextMessageEndEventSchema>;
type ToolCallStartEventProps = EventProps<typeof ToolCallStartEventSchema>;
type ToolCallArgsEventProps = EventProps<typeof ToolCallArgsEventSchema>;
type ToolCallEndEventProps = EventProps<typeof ToolCallEndEventSchema>;
type ToolCallChunkEventProps = EventProps<typeof ToolCallChunkEventSchema>;
type ToolCallResultEventProps = EventProps<typeof ToolCallResultEventSchema>;
type ThinkingStartEventProps = EventProps<typeof ThinkingStartEventSchema>;
type ThinkingEndEventProps = EventProps<typeof ThinkingEndEventSchema>;
type StateSnapshotEventProps = EventProps<typeof StateSnapshotEventSchema>;
type StateDeltaEventProps = EventProps<typeof StateDeltaEventSchema>;
type MessagesSnapshotEventProps = EventProps<typeof MessagesSnapshotEventSchema>;
type ActivitySnapshotEventProps = EventProps<typeof ActivitySnapshotEventSchema>;
type ActivityDeltaEventProps = EventProps<typeof ActivityDeltaEventSchema>;
type RawEventProps = EventProps<typeof RawEventSchema>;
type CustomEventProps = EventProps<typeof CustomEventSchema>;
type RunStartedEventProps = EventProps<typeof RunStartedEventSchema>;
type RunFinishedEventProps = EventProps<typeof RunFinishedEventSchema>;
type RunErrorEventProps = EventProps<typeof RunErrorEventSchema>;
type StepStartedEventProps = EventProps<typeof StepStartedEventSchema>;
type StepFinishedEventProps = EventProps<typeof StepFinishedEventSchema>;
type ReasoningStartEventProps = EventProps<typeof ReasoningStartEventSchema>;
type ReasoningMessageStartEventProps = EventProps<typeof ReasoningMessageStartEventSchema>;
type ReasoningMessageContentEventProps = EventProps<typeof ReasoningMessageContentEventSchema>;
type ReasoningMessageEndEventProps = EventProps<typeof ReasoningMessageEndEventSchema>;
type ReasoningMessageChunkEventProps = EventProps<typeof ReasoningMessageChunkEventSchema>;
type ReasoningEndEventProps = EventProps<typeof ReasoningEndEventSchema>;
type ReasoningEncryptedValueEventProps = EventProps<typeof ReasoningEncryptedValueEventSchema>;
type SubagentStartedEventProps = EventProps<typeof SubagentStartedEventSchema>;
type SubagentFinishedEventProps = EventProps<typeof SubagentFinishedEventSchema>;
type SubagentErrorEventProps = EventProps<typeof SubagentErrorEventSchema>;
type TextMessageStartEvent = z.infer<typeof TextMessageStartEventSchema>;
type TextMessageContentEvent = z.infer<typeof TextMessageContentEventSchema>;
type TextMessageEndEvent = z.infer<typeof TextMessageEndEventSchema>;
type TextMessageChunkEvent = z.infer<typeof TextMessageChunkEventSchema>;
type ThinkingTextMessageStartEvent = z.infer<typeof ThinkingTextMessageStartEventSchema>;
type ThinkingTextMessageContentEvent = z.infer<typeof ThinkingTextMessageContentEventSchema>;
type ThinkingTextMessageEndEvent = z.infer<typeof ThinkingTextMessageEndEventSchema>;
type ToolCallStartEvent = z.infer<typeof ToolCallStartEventSchema>;
type ToolCallArgsEvent = z.infer<typeof ToolCallArgsEventSchema>;
type ToolCallEndEvent = z.infer<typeof ToolCallEndEventSchema>;
type ToolCallChunkEvent = z.infer<typeof ToolCallChunkEventSchema>;
type ToolCallResultEvent = z.infer<typeof ToolCallResultEventSchema>;
type ThinkingStartEvent = z.infer<typeof ThinkingStartEventSchema>;
type ThinkingEndEvent = z.infer<typeof ThinkingEndEventSchema>;
type StateSnapshotEvent = z.infer<typeof StateSnapshotEventSchema>;
type StateDeltaEvent = z.infer<typeof StateDeltaEventSchema>;
type MessagesSnapshotEvent = z.infer<typeof MessagesSnapshotEventSchema>;
type ActivitySnapshotEvent = z.infer<typeof ActivitySnapshotEventSchema>;
type ActivityDeltaEvent = z.infer<typeof ActivityDeltaEventSchema>;
type RawEvent = z.infer<typeof RawEventSchema>;
type CustomEvent = z.infer<typeof CustomEventSchema>;
type RunStartedEvent = z.infer<typeof RunStartedEventSchema>;
type RunFinishedEvent = z.infer<typeof RunFinishedEventSchema>;
type TokenUsage = z.infer<typeof TokenUsageSchema>;
type RunFinishedOutcome = z.infer<typeof RunFinishedOutcomeSchema>;
type RunFinishedSuccessOutcome = z.infer<typeof RunFinishedSuccessOutcomeSchema>;
type RunFinishedInterruptOutcome = z.infer<typeof RunFinishedInterruptOutcomeSchema>;
type SubagentFinishedOutcome = z.infer<typeof SubagentFinishedOutcomeSchema>;
type SubagentFinishedSuccessOutcome = z.infer<typeof SubagentFinishedSuccessOutcomeSchema>;
type SubagentFinishedSuspendedOutcome = z.infer<typeof SubagentFinishedSuspendedOutcomeSchema>;
type RunErrorEvent = z.infer<typeof RunErrorEventSchema>;
type StepStartedEvent = z.infer<typeof StepStartedEventSchema>;
type StepFinishedEvent = z.infer<typeof StepFinishedEventSchema>;
type ReasoningStartEvent = z.infer<typeof ReasoningStartEventSchema>;
type ReasoningMessageStartEvent = z.infer<typeof ReasoningMessageStartEventSchema>;
type ReasoningMessageContentEvent = z.infer<typeof ReasoningMessageContentEventSchema>;
type ReasoningMessageEndEvent = z.infer<typeof ReasoningMessageEndEventSchema>;
type ReasoningMessageChunkEvent = z.infer<typeof ReasoningMessageChunkEventSchema>;
type ReasoningEndEvent = z.infer<typeof ReasoningEndEventSchema>;
type ReasoningEncryptedValueEvent = z.infer<typeof ReasoningEncryptedValueEventSchema>;
type ReasoningEncryptedValueSubtype = z.infer<typeof ReasoningEncryptedValueSubtypeSchema>;
type SubagentStartedEvent = z.infer<typeof SubagentStartedEventSchema>;
type SubagentFinishedEvent = z.infer<typeof SubagentFinishedEventSchema>;
type SubagentErrorEvent = z.infer<typeof SubagentErrorEventSchema>;
//#endregion
//#region src/token-usage.d.ts
/**
 * Map a LangChain-family `usage_metadata` object into an AG-UI {@link TokenUsage}.
 *
 * LangChain and LangGraph both attach usage as `{ input_tokens, output_tokens,
 * total_tokens, input_token_details: { cache_read }, output_token_details:
 * { reasoning } }`. This maps only those numeric counts plus optional
 * provider/model labels — never prompt/completion content. Returns `undefined`
 * when no usable count is present, so callers can omit usage rather than
 * report zeros.
 */
declare function tokenUsageFromLangChainMetadata(usageMetadata: unknown, {
  provider,
  model
}: {
  provider?: string;
  model?: string;
}): TokenUsage | undefined;
/**
 * Map an AI-SDK (v5) `LanguageModelUsage` object into an AG-UI {@link TokenUsage}.
 *
 * AI-SDK's keys already match: `inputTokens`, `outputTokens`, `totalTokens`,
 * `reasoningTokens`, `cachedInputTokens`. AI-SDK reports `NaN`/`undefined` for
 * counts a provider didn't return, so only finite numbers are copied. Returns
 * `undefined` when no finite count is present (so callers omit empty usage).
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
export { AGUIConnectNotImplementedError, AGUIError, AGUIEvent, AGUIEventByType, AGUIEventOf, AGUI_METADATA_KEY, ActivityDeltaEvent, ActivityDeltaEventProps, ActivityDeltaEventSchema, ActivityMessage, ActivityMessageSchema, ActivitySnapshotEvent, ActivitySnapshotEventProps, ActivitySnapshotEventSchema, type AgentCapabilities, AgentCapabilitiesSchema, AssistantMessage, AssistantMessageSchema, AudioInputContent, AudioInputContentSchema, AudioInputPart, AudioInputPartSchema, BaseEvent, BaseEventFields, BaseEventProps, BaseEventSchema, BaseMessageSchema, BinaryInputContent, BinaryInputContentSchema, Context, ContextSchema, CustomEvent, CustomEventProps, CustomEventSchema, DeveloperMessage, DeveloperMessageSchema, DocumentInputContent, DocumentInputContentSchema, DocumentInputPart, DocumentInputPartSchema, EventPayloadOf, EventSchemas, EventType, type ExecutionCapabilities, ExecutionCapabilitiesSchema, FunctionCall, FunctionCallSchema, type HumanInTheLoopCapabilities, HumanInTheLoopCapabilitiesSchema, type IdentityCapabilities, IdentityCapabilitiesSchema, ImageInputContent, ImageInputContentSchema, ImageInputPart, ImageInputPartSchema, InputContent, InputContentDataSource, InputContentDataSourceSchema, InputContentPart, InputContentSchema, InputContentSource, InputContentSourceSchema, InputContentUrlSource, InputContentUrlSourceSchema, Interrupt, InterruptSchema, Message, MessageSchema, MessagesSnapshotEvent, MessagesSnapshotEventProps, MessagesSnapshotEventSchema, Metadata, MetadataSchema, type MultiAgentCapabilities, MultiAgentCapabilitiesSchema, type MultimodalCapabilities, MultimodalCapabilitiesSchema, type MultimodalInputCapabilities, MultimodalInputCapabilitiesSchema, type MultimodalOutputCapabilities, MultimodalOutputCapabilitiesSchema, OptionalMetadataSchema, type OutputCapabilities, OutputCapabilitiesSchema, RawEvent, RawEventProps, RawEventSchema, type ReasoningCapabilities, ReasoningCapabilitiesSchema, ReasoningEncryptedValueEvent, ReasoningEncryptedValueEventProps, ReasoningEncryptedValueEventSchema, ReasoningEncryptedValueSubtype, ReasoningEncryptedValueSubtypeSchema, ReasoningEndEvent, ReasoningEndEventProps, ReasoningEndEventSchema, ReasoningMessage, ReasoningMessageChunkEvent, ReasoningMessageChunkEventProps, ReasoningMessageChunkEventSchema, ReasoningMessageContentEvent, ReasoningMessageContentEventProps, ReasoningMessageContentEventSchema, ReasoningMessageEndEvent, ReasoningMessageEndEventProps, ReasoningMessageEndEventSchema, ReasoningMessageSchema, ReasoningMessageStartEvent, ReasoningMessageStartEventProps, ReasoningMessageStartEventSchema, ReasoningStartEvent, ReasoningStartEventProps, ReasoningStartEventSchema, ResumeEntry, ResumeEntrySchema, ResumeStatus, Role, RoleSchema, RunAgentInput, RunAgentInputSchema, RunErrorEvent, RunErrorEventProps, RunErrorEventSchema, RunFinishedEvent, RunFinishedEventProps, RunFinishedEventSchema, RunFinishedInterruptOutcome, RunFinishedInterruptOutcomeSchema, RunFinishedOutcome, RunFinishedOutcomeSchema, RunFinishedSuccessOutcome, RunFinishedSuccessOutcomeSchema, RunStartedEvent, RunStartedEventProps, RunStartedEventSchema, State, type StateCapabilities, StateCapabilitiesSchema, StateDeltaEvent, StateDeltaEventProps, StateDeltaEventSchema, StateSchema, StateSnapshotEvent, StateSnapshotEventProps, StateSnapshotEventSchema, StepFinishedEvent, StepFinishedEventProps, StepFinishedEventSchema, StepStartedEvent, StepStartedEventProps, StepStartedEventSchema, type SubAgentInfo, SubAgentInfoSchema, SubagentErrorEvent, SubagentErrorEventProps, SubagentErrorEventSchema, SubagentFinishedEvent, SubagentFinishedEventProps, SubagentFinishedEventSchema, SubagentFinishedOutcome, SubagentFinishedOutcomeSchema, SubagentFinishedSuccessOutcome, SubagentFinishedSuccessOutcomeSchema, SubagentFinishedSuspendedOutcome, SubagentFinishedSuspendedOutcomeSchema, SubagentStartedEvent, SubagentStartedEventProps, SubagentStartedEventSchema, SystemMessage, SystemMessageSchema, TextInputContent, TextInputContentSchema, TextMessageChunkEvent, TextMessageChunkEventProps, TextMessageChunkEventSchema, TextMessageContentEvent, TextMessageContentEventProps, TextMessageContentEventSchema, TextMessageEndEvent, TextMessageEndEventProps, TextMessageEndEventSchema, TextMessageStartEvent, TextMessageStartEventProps, TextMessageStartEventSchema, ThinkingEndEvent, ThinkingEndEventProps, ThinkingEndEventSchema, ThinkingStartEvent, ThinkingStartEventProps, ThinkingStartEventSchema, ThinkingTextMessageContentEvent, ThinkingTextMessageContentEventProps, ThinkingTextMessageContentEventSchema, ThinkingTextMessageEndEvent, ThinkingTextMessageEndEventProps, ThinkingTextMessageEndEventSchema, ThinkingTextMessageStartEvent, ThinkingTextMessageStartEventProps, ThinkingTextMessageStartEventSchema, TokenUsage, TokenUsageSchema, Tool, ToolCall, ToolCallArgsEvent, ToolCallArgsEventProps, ToolCallArgsEventSchema, ToolCallChunkEvent, ToolCallChunkEventProps, ToolCallChunkEventSchema, ToolCallEndEvent, ToolCallEndEventProps, ToolCallEndEventSchema, ToolCallResultEvent, ToolCallResultEventProps, ToolCallResultEventSchema, ToolCallSchema, ToolCallStartEvent, ToolCallStartEventProps, ToolCallStartEventSchema, ToolMessage, ToolMessageSchema, ToolSchema, type ToolsCapabilities, ToolsCapabilitiesSchema, type TransportCapabilities, TransportCapabilitiesSchema, UserMessage, UserMessageSchema, VideoInputContent, VideoInputContentSchema, VideoInputPart, VideoInputPartSchema, aggregateTokenUsage, mergeMetadata, tokenUsageFromAiSdkUsage, tokenUsageFromLangChainMetadata };
//# sourceMappingURL=index.d.ts.map