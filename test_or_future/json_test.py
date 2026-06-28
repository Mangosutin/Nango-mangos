import json
from jsonschema import Draft202012Validator
from jsonschema.exceptions import ValidationError


def JSON_loader(subject, schema):
    try:
        validator = Draft202012Validator(schema)
        validator.validate(sample)
        adapted_json = json.dumps(sample, sort_keys=0, ensure_ascii=False, indent=2)
        print(adapted_json)
        return sample
    except ValidationError as e:
        print(e.message)
    print("END")


if __name__ == "__main__":
    sample_path = r"C:\Users\Ariku\OneDrive\Documents\Nango\test_or_future\sample.json"
    schema_path = r"C:\Users\Ariku\OneDrive\Documents\Nango\test_or_future\pre_JSON_schema.json"

    with open(sample_path, mode="r", encoding="utf-8") as smp_ld:
        with open(schema_path, mode="r", encoding="utf-8") as sch_ld:
            sample = json.loads(smp_ld.read())
            schema = json.loads(sch_ld.read())

            JSON_loader(sample, schema)
