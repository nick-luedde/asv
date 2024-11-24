# AppsSchemaValidation

Apply an schema to arbitraty js.
Just copy the [AppsSchemaValidation.js](AppsSchemaValidation.js) file into your project to get started.

## Using the library

Here's a basic example of using the lib:

```JavaScript
function validation() {
  const asv = AppsSchemaValidation.asv();

  const schema = asv.build({
    title: asv.string().required(),
    tags: asv.array().schema(asv.string()),
    rating: asv.number()
  });

  const validResults = schema.validate({
    title: 'Hey I\'m valid!',
    tags: ['awesome', 'rad'],
    rating: 10
  });

  // No errors...

  const errors = schema.validate({
    tags: [1],
    rating: 'Not a number...'
  });

  // Errors...
  /*
  {
    "errors": [],
    "item": {
      "title": {
        "errors": [
          "Is required"
        ],
        "hasError": true
      },
      "tags": {
        "errors": [],
        "hasError": true,
        "items": [
          {
            "errors": [
              "Is not a string"
            ],
            "hasError": true
          }
        ]
      },
      "rating": {
        "errors": [
          "Is not a number"
        ],
        "hasError": true
      }
    },
    "hasError": true
  }
  */

}
```


For more examples, [check out Examples.ts](src/Examples.ts)