export function validateTextOnly(
  value,
  fieldName
) {

  if (
    /^\d+$/.test(
      value.trim()
    )
  ) {

    return `${fieldName} cannot contain only numbers`;

  }

  return "";

}