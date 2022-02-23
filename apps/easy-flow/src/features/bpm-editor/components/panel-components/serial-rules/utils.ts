import { RuleOption } from "@type";

export const filterRules = (rules: RuleOption[], fields: { [key: string]: any }[]) => {
  return rules
    ?.map((item: any) => {
      if (item.type === "fieldName" && fields.find((field) => field.id === item.fieldValue)) {
        return item;
      }
      return item.type !== "fieldName" && item;
    })
    .filter(Boolean);
};
