
function addProductBodyValidator(body) {
  const errors = [];

  if (body.name === undefined) {
    errors.push("Product name is required");
  } else if (body.name.trim() === "") {
    errors.push("Product name cannot be empty");
  }
  if (body.description === undefined) {
    errors.push("Product description is required");
  } else if (body.description.trim() === "") {
    errors.push("Product description cannot be empty");
  }
  if (body.unit_price === undefined) {
    errors.push("Product price is required");
  } else if (body.unit_price <= 0) {
    errors.push("Product price must be greater than zero");
  }
  if (body.unit_weight === undefined) {
    errors.push("Product weight is required");
  } else if (body.unit_weight <= 0) {
    errors.push("Product weight must be greater than zero");
  }
  if (body.category_name === undefined) {
    errors.push("Product category is required");
  } else if (body.category_name.trim() === "") {
    errors.push("Product category cannot be empty");
  }
  return errors;
}

function updateProductBodyValidator(body) {
  const errors = [];

  if (body.name !== undefined && body.name.trim() === "") {
    errors.push("Name cannot be empty");
  }
  if (body.description !== undefined && body.description.trim() === "") {
    errors.push("Description cannot be empty");
  }
  if (body.unit_price !== undefined && body.unit_price <= 0) {
    errors.push("Price must be greater than zero");
  }
  if (body.unit_weight !== undefined && body.unit_weight <= 0) {
    errors.push("Weight must be greater than zero");
  }

  return errors;
}

export { addProductBodyValidator, updateProductBodyValidator };
