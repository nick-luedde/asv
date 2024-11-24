class AppsSchemaValidationTests {

  static run() {
    const registry = new AutomatedTestRegistry();

    registry.registerTest('string', /** @param {AutomatedTest} test */(test) => {

      const asv = AppsSchemaValidation.asv();

      const string_is = asv.string();

      test.is('type is string').assert.isEqual(string_is.type, 'string');

      const nonstrings_to_test = [{}, 123, 0, true, false, [], new Date(), Infinity];
      nonstrings_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_is.evaluate(v);
        test.is(`${v} (index: ${i}) is not a string [hasErrors]`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is not a string [error]`).assert.isEqual(error, 'Is not a string');
        test.is(`${v} (index: ${i}) is not a string [only one error]`).assert.isEqual(results.errors.length, 1);
        // test.is(`${v} (index: ${i}) is not a string [error thrown during exec]`).assert.exceptionThrown(() => string_is.exec(v));
      });

      const strings_to_test = ['', '1234', 'abcda', '1234asdfga4t323r'];
      strings_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_is.evaluate(v);
        test.is(`${v} (index: ${i}) is a string [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is a string no errors`).assert.isEqual(results.errors.length, 0);
        // test.is(`${v} (index: ${i}) is a string [error not thrown during exec]`).assert.exceptionNotThrown(() => string_is.exec(v));
      });

      const string_required = asv.string().required();

      const missing_to_test = [null, undefined, ''];
      missing_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_required.evaluate(v);
        test.is(`${v} (index: ${i}) is missing`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is missing [error]`).assert.isEqual(error, 'Is required');
        test.is(`${v} (index: ${i}) is missing [only one error]`).assert.isEqual(results.errors.length, 1);
        // test.is(`${v} (index: ${i}) is missing [error thrown during exec]`).assert.exceptionThrown(() => string_required.exec(v));
      });

      const not_missing_to_test = ['_', 'undefined', 'abcdefgh'];
      not_missing_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_required.evaluate(v);
        test.is(`${v} (index: ${i}) is not missing [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is not missing no errors`).assert.isEqual(results.errors.length, 0);
        // test.is(`${v} (index: ${i}) is not missing [error not thrown during exec]`).assert.exceptionNotThrown(() => string_required.exec(v));
      });

      const string_max = asv.string().max(10);

      const overmax_to_test = ['12345678910', 'wayy toooo  long here', 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv'];
      overmax_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_max.evaluate(v);
        test.is(`${v} (index: ${i}) is too long`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is too long [error]`).assert.isEqual(error, 'Must be less than 10 in length');
        test.is(`${v} (index: ${i}) is too long [only one error]`).assert.isEqual(results.errors.length, 1);
        // test.is(`${v} (index: ${i}) is too long [error thrown during exec]`).assert.exceptionThrown(() => string_max.exec(v));
      });

      const undermax_to_test = ['', '1234567890', 'abc-123'];
      undermax_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_max.evaluate(v);
        test.is(`${v} (index: ${i}) is under max [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is under max no errors`).assert.isEqual(results.errors.length, 0);
        // test.is(`${v} (index: ${i}) is under max [error not thrown during exec]`).assert.exceptionNotThrown(() => string_max.exec(v));
      });


      const string_min = asv.string().min(4);

      const undermin_to_test = ['123', ' ', 'ab'];
      undermin_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_min.evaluate(v);
        test.is(`${v} (index: ${i}) is too short`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is too short [error]`).assert.isEqual(error, 'Must be greater than 4 in length');
        test.is(`${v} (index: ${i}) is too short [only one error]`).assert.isEqual(results.errors.length, 1);
        // test.is(`${v} (index: ${i}) is too short [error thrown during exec]`).assert.exceptionThrown(() => string_min.exec(v));
      });

      const overmin_to_test = ['1234', '1234567890', 'abc-123'];
      overmin_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_min.evaluate(v);
        test.is(`${v} (index: ${i}) is over min [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is over min no errors`).assert.isEqual(results.errors.length, 0);
        // test.is(`${v} (index: ${i}) is over min [error not thrown during exec]`).assert.exceptionNotThrown(() => string_min.exec(v));
      });


      const string_valid = asv.string().valid((val) => val === 'must be this', 'Custom error!');

      const invalid_to_test = ['something else', '', 'whatever'];
      invalid_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_valid.evaluate(v);
        test.is(`${v} (index: ${i}) is not valid`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is not valid [error]`).assert.isEqual(error, 'Custom error!');
        test.is(`${v} (index: ${i}) is not valid [only one error]`).assert.isEqual(results.errors.length, 1);
        // test.is(`${v} (index: ${i}) is not valid [error thrown during exec]`).assert.exceptionThrown(() => string_valid.exec(v));
      });

      const valid_to_test = ['must be this', 'must be this'];
      valid_to_test.forEach((v, i) => {
        const { results, hasErrors } = string_valid.evaluate(v);
        test.is(`${v} (index: ${i}) is valid [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is valid no errors`).assert.isEqual(results.errors.length, 0);
        // test.is(`${v} (index: ${i}) is valid [error not thrown during exec]`).assert.exceptionNotThrown(() => string_valid.exec(v));
      });

      const string_default = asv.string().default(() => 'default string');
      const default_applied = string_default.apply(null, null, { isNew: true });
      test.is('default applied').assert.isEqual(default_applied, 'default string');

      const default_already_valued = string_default.apply('something already set', null, { isNew: true });
      test.is('default already has value').assert.isEqual(default_already_valued, 'something already set');

      const default_not_applied = string_default.apply(null);
      test.is('default applied').assert.isEqual(default_not_applied, null);

      const string_update = asv.string().update((val) => `${val} updated!`);

      const update_applied = string_update.apply('', 'Yes,');
      test.is('update applied').assert.isEqual(update_applied, 'Yes, updated!');

      const string_parsed = asv.string().parse('parsed');
      test.is('string parsed').assert.isEqual(string_parsed, 'parsed');

      const string_num_parsed = asv.string().parse(123);
      test.is('string number parsed').assert.isEqual(string_num_parsed, '123');

      const string_bool_parsed = asv.string().parse(false);
      test.is('string number parsed').assert.isEqual(string_bool_parsed, 'false');

    });


    // for now lets assume the other types are mostly working the same....
    registry.registerTest('datestring', /** @param {AutomatedTest} test */(test) => {
      const asv = AppsSchemaValidation.asv();

      const datestring_is = asv.datestring();
      
      test.is('type is datestring').assert.isEqual(datestring_is.type, 'datestring');

      const non_datestrings_to_test = [{}, 123, '-01-01', 'Nov 12th, 2021', 'ABCD-EF-GH', '01/02/2022', '23-1-1', false, [], new Date(), Infinity];
      non_datestrings_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_is.evaluate(v);
        test.is(`${v} (index: ${i}) is not a datestring [hasErrors]`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is not a datestring [error]`).assert.isEqual(error, 'Is not a date-string');
        test.is(`${v} (index: ${i}) is not a datestring [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      //TODO: allows invalid dates as a string since they follow the simple ####-##-## pattern
      const strings_to_test = ['2023-01-01', '1-01-10', '9999-00-00', '30030-12-17', '00-99-99'];
      strings_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_is.evaluate(v);
        test.is(`${v} (index: ${i}) is a datestring [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is a datestring no errors`).assert.isEqual(results.errors.length, 0);
      });

      const datestring_max = asv.datestring().max('1999-01-01');
      const overmax_to_test = ['1999-01-02', '2020-10-23', '2000-02-02']; //'10000-02-02' is is invalid!!
      overmax_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_max.evaluate(v);
        test.is(`${v} (index: ${i}) is past max`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is past max [error]`).assert.isEqual(error, 'Must be less than 1999-01-01');
        test.is(`${v} (index: ${i}) is past max [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      const undermax_to_test = ['1998-12-30', '1960-01-01', '100-02-03'];
      undermax_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_max.evaluate(v);
        test.is(`${v} (index: ${i}) is under max [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is under max no errors`).assert.isEqual(results.errors.length, 0);
      });

      const datestring_min = asv.datestring().min('1980-04-09');
      const undermin_to_test = ['1980-04-08', '1970-01-01', '100-12-12'];
      undermin_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_min.evaluate(v);
        test.is(`${v} (index: ${i}) is too early`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is too early [error]`).assert.isEqual(error, 'Must be greater than 1980-04-09');
        test.is(`${v} (index: ${i}) is too early [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      const overmin_to_test = ['1980-04-10', '2000-10-10', '1999-01-01'];
      overmin_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_min.evaluate(v);
        test.is(`${v} (index: ${i}) is over min [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is over min no errors`).assert.isEqual(results.errors.length, 0);
      });

    });


    registry.registerTest('jsondate', /** @param {AutomatedTest} test */(test) => {
      const asv = AppsSchemaValidation.asv();

      const datestring_is = asv.jsondate();
      
      test.is('type is jsondate').assert.isEqual(datestring_is.type, 'jsondate');

      const non_jsondates_to_test = [{}, 123, '2021-01-01T00:00:00', 'Nov 12th, 2021', 'ABCD-EF-GH', '01/02/2022', '23-1-1', false, [], new Date(), Infinity];
      non_jsondates_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_is.evaluate(v);
        test.is(`${v} (index: ${i}) is not a jsondate [hasErrors]`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is not a jsondate [error]`).assert.isEqual(error, 'Is not a json date string');
        test.is(`${v} (index: ${i}) is not a jsondate [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      //TODO: allows invalid dates as a string since they follow the simple ####-##-##T##:##:##.###Z pattern
      const strings_to_test = ['2023-01-01T12:34:56.789Z', '1-01-10T99:88:77.370Z', '9999-00-00T00:00:00.000Z', '30030-12-17T10:01:10.010Z', '00-99-99T21:47:24.960Z'];
      strings_to_test.forEach((v, i) => {
        const { results, hasErrors } = datestring_is.evaluate(v);
        test.is(`${v} (index: ${i}) is a jsondate [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is a jsondate no errors`).assert.isEqual(results.errors.length, 0);
      });

      const jsondate_max = asv.datestring().max('2023-01-01T00:10:10.900Z');
      const overmax_to_test = ['2023-01-01T00:10:11.900Z', '2100-12-01T00:10:10.900Z', '3000-01-01T00:10:10.900Z'];
      overmax_to_test.forEach((v, i) => {
        const { results, hasErrors } = jsondate_max.evaluate(v);
        test.is(`${v} (index: ${i}) is past max`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is past max [error]`).assert.isEqual(error, 'Must be less than 2023-01-01T00:10:10.900Z');
        test.is(`${v} (index: ${i}) is past max [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      const undermax_to_test = ['2023-01-01T00:10:09.900Z', '2000-01-01T00:10:11.900Z', '100-01-01T00:10:11.900Z'];
      undermax_to_test.forEach((v, i) => {
        const { results, hasErrors } = jsondate_max.evaluate(v);
        test.is(`${v} (index: ${i}) is under max [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is under max no errors`).assert.isEqual(results.errors.length, 0);
      });

      const jsondate_min = asv.jsondate().min('1907-01-01T00:10:10.900Z');
      const undermin_to_test = ['1907-01-01T00:10:09.900Z', '1188-01-01T00:10:10.900Z', '100-12-12T00:10:10.900Z'];
      undermin_to_test.forEach((v, i) => {
        const { results, hasErrors } = jsondate_min.evaluate(v);
        test.is(`${v} (index: ${i}) is too early`).assert.isTrue(hasErrors);
        const [error] = results.errors;
        test.is(`${v} (index: ${i}) is too early [error]`).assert.isEqual(error, 'Must be greater than 1907-01-01T00:10:10.900Z');
        test.is(`${v} (index: ${i}) is too early [only one error]`).assert.isEqual(results.errors.length, 1);
      });

      const overmin_to_test = ['1980-04-10T00:10:10.900Z', '2000-10-10T00:10:10.900Z', '1999-01-01T00:10:10.900Z'];
      overmin_to_test.forEach((v, i) => {
        const { results, hasErrors } = jsondate_min.evaluate(v);
        test.is(`${v} (index: ${i}) is over min [hasErrors]`).assert.isFalse(hasErrors);
        test.is(`${v} (index: ${i}) is over min no errors`).assert.isEqual(results.errors.length, 0);
      });
    });


    registry.registerTest('Person schema', /** @param {AutomatedTest} test */(test) => {

      const asv = AppsSchemaValidation.asv();

      const Person = asv.build({
        id: asv.number().required().default(() => 1),

        name: asv.string().required(),

        interests: asv.array().schema(asv.string().required()),

        position: asv.object().schema({
          title: asv.string().required().max(25),
          desc: asv.string(),
          details: asv.object().schema({
            salaries: asv.array().schema({ min: asv.number().min(0), max: asv.number(1000 * 100 * 5) }),
            current: asv.number().valid((curr, model) =>
              model.position.details.salaries.every(({ min }) => curr >= min)
              && model.position.details.salaries.every(({ max }) => curr <= max),
              'Current salary not within listed salaries'
            )
          })
        }).required(),

        birthday: asv.date().required().min(new Date(1900, 0, 1)),

        website: asv.url(),

        activeUser: asv.boolean().required().default(() => true),

        books: asv.array().resolver(books => books.map(b => ({ id: b.id, title: b.title }))),

        resume: asv.file().required(),

        created: asv.timestamp().default(),

      });


      {
        const invalid_person_obj = {
          id: null,
          name: 'Test bop person',
          interests: [null],
          position: {
            title: 'This title has more than 25 chars in length',
            details: {
              salaries: [{ min: 12, max: 34 }],
              current: 8
            }
          },
          birthday: new Date(1890, 0, 1),
          website: 'some.non.https://url',
          activeUser: null,
          resume: { id: 123, url: 'Not a url', extra: 'Some extra val outside of file/blob schema' },
          created: null
        };

        test.is('invalid_person_obj errors on exec').assert.exceptionThrown(
          () => Person.exec(invalid_person_obj, { isNew: true })
        );

        const { results, hasErrors } = Person.validate(invalid_person_obj);
        test.is('invalid_person_obj has errors').assert.isTrue(hasErrors);

        test.is('invalid_person_obj required interests value').assert.isEqual(results.interests.children[0].errors.length, 1);
        test.is('invalid_person_obj required interests value').assert.isEqual(results.interests.children[0].errors[0], 'Is required');

        test.is('invalid_person_obj position.title is too long').assert.isEqual(results.position.children.title.errors[0], 'Must be less than 25 in length');
        test.is('invalid_person_obj position.details.current').assert.isEqual(results.position.children.details.children.current.errors[0], 'Current salary not within listed salaries');

        test.is('invalid_person_obj birthday below min').assert.isEqual(results.birthday.errors[0], 'Must be greater than Mon Jan 01 1900 00:00:00 GMT-0700 (Mountain Standard Time)');
        test.is('invalid_person_obj active user required').assert.isEqual(results.activeUser.errors[0], 'Is required');
        test.is('invalid_person_obj website not url').assert.isEqual(results.website.errors[0], "Is not an 'https' url");

        test.is('invalid_person_obj resume.id not string').assert.isEqual(results.resume.children.id.errors[0], 'Is not a string');
        test.is('invalid_person_obj resume.url not url').assert.isEqual(results.resume.children.url.errors[0], "Is not an 'https' url");
      }

      {
        const valid_person_obj = {
          id: null,
          name: 'Who knew it',
          interests: ['Books!', 'Popcorn!'],
          position: {
            title: 'Pun king',
            details: {
              salaries: [{ min: 100, max: 1500 }],
              current: 990
            }
          },
          birthday: new Date(1950, 10, 11),
          website: 'https://drive.google.com',
          activeUser: true,
          books: [{ id: 1, title: 'Pet Semetary', other: 'Removed by resolver' }],
          resume: { id: 'abc-123', name: 'Test.file', url: 'https://drive.google.com/', extra: 'An extra prop' },
          created: null
        };

        try {
          const now = new Date().toJSON();
          const per = Person.exec(valid_person_obj, { isNew: true });

          test.is('per is new object').assert.isTrue(per !== valid_person_obj);
          test.is('per.id defaults to 1').assert.isEqual(per.id, 1);
          test.is('per.created is string').assert.typeIs(per.created, 'string');
          test.is('per.interests stringified').assert.typeIs(per.interests, 'string');
          test.is('per.interests json').assert.isEqual(per.interests, JSON.stringify(valid_person_obj.interests));
          test.is('per.position stringified').assert.typeIs(per.position, 'string');
          test.is('per.position json').assert.isEqual(per.position, JSON.stringify(valid_person_obj.position));
          test.is('per.activeUser is true').assert.isEqual(per.activeUser, true);
          test.is('per.website is string').assert.isEqual(per.website, 'https://drive.google.com');
          test.is('per.resume stringified').assert.typeIs(per.resume, 'string');
          test.is('per.resume json').assert.isEqual(per.resume, JSON.stringify({ ...valid_person_obj.resume, extra: undefined }));

          test.is('per.books resolved (missing "other" prop)').assert.isEqual(per.books, '[{"id":1,"title":"Pet Semetary"}]');
          test.is('per.created has a date').assert.isTrue(now <= per.created);

        } catch (err) {
          test.is('Person.exec(valid_person_obj) [Error]').assert.exceptionNotThrown(() => { throw new Error(err) });
        }
      }

    });

    registry.runAllTests();
    registry.consoleFailures();

    return registry.getFailureReport();
  }

}

function run_tests() {
  return AppsSchemaValidationTests.run();
}