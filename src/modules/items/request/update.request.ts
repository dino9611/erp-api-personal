import Validatorjs from "validatorjs";
import { ApiErrorCustom } from "@src/utils/api-error-custom.js";

export const validate = (body: any) => {
  const validation = new Validatorjs(
    body,
    {
      name: "required",
      chartOfAccount: "required",
      unit: "required",
    },
    {
      required: ":attribute is required",
    }
  );
  validation.setAttributeNames({ chartOfAccount: "chart of account" });

  if (validation.fails()) {
    throw new ApiErrorCustom(422, "Unprocessable Entity", validation.errors.errors);
  }
};
