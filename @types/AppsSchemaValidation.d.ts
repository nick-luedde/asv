type Asv = ReturnType<typeof AppsSchemaValidation.asv>;

type AsvSchemeType = 'any' | 'id' | 'string' | 'url' | 'number' | 'boolean' | 'date' | 'datestring' | 'datetimestring' | 'jsondate' | 'timestamp' | 'audit' | 'array' | 'object' | 'file';
type AsvStorable = string | number | null | undefined;

interface AsvSchemaContext<S extends AsvSchema> {
  schema: S;
  test: <T>(obj: T) => AsvValidation<T>;
  apply: <T>(obj: T, { isNew }: { isNew: boolean }) => T;
  validate: <T>(obj: T, { throwError }: { throwError: boolean }) => AsvValidation<T>;
  exec: <T>(obj: T, { isNew, throwError }: { isNew: boolean, throwError: boolean }) => T;
  errors: (obj: any) => ReturnType<AsvErrors>;
  parse: <T>(obj: T) => T;
  generate: <T>(obj: T, { empty }: { empty: boolean }) => T;
}

type AsvGetSchemaContext = <S>(schema: S) => AsvSchemaContext<S>;

interface BaseAsvTypeContext<Type> {
  type: AsvSchemeType;
  label: string;
  rules: ((val: Type, mdl?: unknown) => string | false)[];
  client: { [key: string]: string | boolean | number };
  defaultFn?: () => Type;
  updateFn?: <M>(mdl: M) => Type;
  valid: {
    msg: string;
    check?: <M>(val: Type, mdl: M) => boolean
    isValid: <M>(val: Type, mdl: M) => string | false;
  };
  resolver?: (val: any) => Type;
  sub: {
    schema: AsvAny; //figure this out later
    isSimple: boolean;
  };
}

interface BaseAsvType<Type, Rtn> {
  required: () => Rtn;
  max?: (mx: number) => Rtn;
  min?: (mn: number) => Rtn;
  default?: (fn: () => Type | null) => Rtn;
  update?: (fn: () => Type | null) => Rtn;
  valid?: (fn: (mdl: any) => boolean, msg?: string) => Rtn;
  resolver?: (fn: <T>(val: T) => Type) => Rtn;
  schema?: (obj: unknown) => Rtn;
  client: {
    get: StringObject,
    set: (key: string, val: string) => Rtn;
  };

  evaluate: (val: Type, mdl: unknown) => AsvValidation<Type>;
  apply: (val: Type, model: unknown, options?: { isNew: boolean }) => Type,
  exec: (val: Type, model: unknown, options?: { isNew?: boolean, noStringify: boolean }) => { validation: AsvValidation<Type>, storage: AsvStorable };
  parse: (val: AsvStorable) => Type;
}

type AsvAnyApi<Rtn> = BaseAsvType<object | any[], Rtn>;
interface AsvAny extends AsvAnyApi<AsvAny> { };

type AsvIdApi<Rtn> = Pick<BaseAsvType<string, Rtn>, "client">;
interface AsvId extends AsvIdApi<AsvId> { };

type AsvStringApi<Rtn> = Omit<BaseAsvType<string, Rtn>, "resolver" | "schema" | "max" | "min">;
interface AsvString extends AsvStringApi<AsvString> { infer: string };
interface AsvUrl extends AsvStringApi<AsvUrl> { infer: string };

type AsvNumberApi<Rtn> = Omit<BaseAsvType<number, Rtn>, "resolver" | "schema">;
interface AsvNumber extends AsvNumberApi<AsvNumber> { infer: number };

type AsvBooleanApi<Rtn> = Omit<BaseAsvType<boolean, Rtn>, "resolver" | "schema" | "minlength" | "maxlength" | "max" | "min">;
interface AsvBoolean extends AsvBooleanApi<AsvBoolean> { infer: boolean };

type AsvDateApi<Rtn> = Omit<BaseAsvType<Date, Rtn>, "resolver" | "schema">;
interface AsvDate extends AsvDateApi<AsvDate> { infer: Date };

interface AsvDateString extends AsvStringApi<AsvDateString> { };
interface AsvDateTimeString extends AsvStringApi<AsvDateTimeString> { };
interface AsvJsonDate extends AsvStringApi<AsvJsonDate> { };

type AsvTimestampApi<Rtn> = Omit<BaseAsvType<string, Rtn>, "resolver" | "schema" | "min" | "max">;
interface AsvTimestamp extends AsvTimestampApi<AsvTimestamp> { infer: string };

type AsvAuditApi<Rtn> = Omit<BaseAsvType<string, Rtn>, "resolver" | "schema" | "min" | "max">;
interface AsvAudit extends AsvAuditApi<AsvAudit> { infer: string };

interface AsvArray<Type> extends BaseAsvType<Array<Type>, AsvArray<Type>> { infer: Type[] };
interface AsvObject<Type> extends BaseAsvType<Type, AsvObject<Type>> { };

type AsvFileObject = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
};
interface AsvFile<Type = AsvFileObject> extends BaseAsvType<Array<Type>, AsvFile<Type>> {
  size?: (ms: number) => AsvFile<Type>;
  types?: (types: string | string[]) => AsvFile<Type>;
};

type AsvValidation<Type> = Type extends any[]
  ? AsvValidationArray<Type>
  : Type extends object
  ? AsvValidationObject<Type>
  : AsvValidationPrimitive;

type AsvValidationPrimitive = { errors: string[], hasError: boolean };
type AsvValidationObject<Type> = { item: { [Prop in keyof Type]: AsvValidation<Type[Prop]> } } & AsvValidationPrimitive;
type AsvValidationArray<Type> = { items: AsvValidation<Type extends (infer Inner)[] ? Inner : never>[] } & AsvValidationPrimitive;

type AsvValidate = <T, S>(schema: S, obj: T, options: { throwError: boolean }) => AsvValidation<T>;

type AsvApply = <T, S>(scheme: S, obj: T, model: TaskModelDetail, { isNew, noStringify }: { isNew: boolean, noStringify: boolean }) => T;

type AsvExec = <T, S>(scheme: S, obj: T, { isNew, throwError }: { isNew: boolean, throwError: boolean }) => T;

type AsvErrors = (obj: any) => { path: string, errors: string[] }[];

type AsvParse = <T, S>(scheme: S, obj: T) => T;

type AsvGenerate = <T>(scheme: S, obj: T, obj: T, { empty }: { empty: boolean }) => T;

interface AsvSchema {
  [key: string]: AsvAny;
};

type AsvRawType = {
  type: AsvSchemeType
  required?: boolean;
  max?: number;
  min?: number;
  default?: () => any;
  update?: () => any;
  valid?: (mdl: any) => boolean;
  resolver?: (val: any) => any;
  types?: string | string[];
  size?: number;
  schema?: AsvRawType;
  client?: StringObject;
};

type AsvRawSchema<R extends AsvRawSchema<R>> = {
  [Prop in keyof R]: AsvRawType;
};


type AsvRawToSchema<R> = {
  [Prop in keyof R]: AsvAny;
};

type AsvFromRaw = <R>(raw: R) => AsvRawToSchema<R>;

//TODO: could keep working on this definition... 
type SchemaToRaw<Scheme> = {
  [Prop in keyof Scheme]: Scheme[Prop] extends { infer: any } ? Scheme[Prop]["infer"] : SchemaToRaw<Scheme[Prop]>;
};

interface AsvSchema {
  [key: string]: AsvSchemaContext;
}

type AsvErrorResults<T> = {
  errors: any[],
  item: {
    [key: keyof T]: AsvErrorResults<typeof T[key]>
  };
  hasError: boolean;
};