import json

"""
//key:val_type$RQ$NS `$`でsplitしてぞくせいを取得します。
//RQ or OP,NS
//OPはoptional:任意ですが、これは省略しましょう
//NSは次にNSchildの説明が必要で、
//chrはcharacter,numとstrです
{
    "id":"chr",
    "datetime":"chr",
    "word":"chr$RQ",//RQ=Required:必須
    "category":"chr",
    "fieldTag":"chr",
    "eraTag":"chr",
    "reading":"chr",
    "kanji":"chr",
    "english":"chr",
    "column":"chr",
    "memo":"chr",
    "gemini_note":"chr",
    "other_tags":"list",
    "meanings":"list$RQ$NS",//NS=Nesting:入れ子
    "NS$meaning":{      //NS should be dict
    "definition":"chr$RQ",
    "background":"chr",
    "nuance":"chr",
    "examples":"list",
    "synonyms":"list"
    }
}

"""


def imp_modelFMT(model: dict, nest_parent: str = ""):
    print("[DEBUG] loading model JSON format...")
    key_cls = {
        "RQ": [],
        "OP": [],
        "NS": [],
    }
    key_vtype = {}
    for i, (k, v) in enumerate(list(model.items())):
        if not set([k[:3], k[:4]]).isdisjoint(set(["NS$", "\\\\"])):
            continue
        # valueをattributeに分割
        attribute = v.split("$")

        if "NS" in attribute:
            # ネスト処理
            """ネスト内の形式はvtypeに
            NS$key:{ns_key:~
                }"""
            try:
                try:  # NSkeyで設定されたNSchildが存在するか
                    NSchild = model["NS$" + k]
                except KeyError:
                    print("[ERROR] next to NS attribute element should be child")
                    return "ERROR"
                key_vtype["NS$" + k] = imp_modelFMT(NSchild, nest_parent=nest_parent + ">" + k)
            except (IndexError, ValueError):
                print("[ERROR] failed load nesting children")
                return "ERROR"

        # 値の型を保存dict,list,cha
        if attribute[0] in ["dict", "list", "chr"]:
            key_vtype[k] = attribute[0]
        else:
            print("[ERROR] not defined type:", attribute[0])
            return "ERROR"

        # keyのクラス割り当て
        if "RQ" in attribute:
            key_cls["RQ"].append(k)
            attribute.remove("RQ")
        elif "OP" in attribute:
            key_cls["OP"].append(k)
            attribute.remove("OP")
        else:
            key_cls["OP"].append(k)

        for a in attribute:  # 拡張性のためにその他属性も自動で入れるようにした
            try:
                key_cls[a].append(k)
            except KeyError:
                if a not in ["list", "chr"]:
                    print("[ERROR] not defined attribute:", a)
                    return "ERROR"
    return key_cls, key_vtype

def JSON_FMT_checker(subj: dict, cls, vtype, nest_parent: str = ""):
    print("[DEBUG] loading word...")
    if nest_parent:
        print("[DEBUG] nest process children parent:", nest_parent)
    for k, v in subj.items():
        if k in cls["RQ"]:
            cls["RQ"].remove(k)
            if (v is None) or not bool(v):
                print("[ERROR] RQ key {k} should have {vtype[k]} value,value={v}")
                print("k", end=":")
                pprint(k)
                print("vtype[k]", end=":")
                pprint(vtype[k])
                print("v", end=":")
                pprint(v)
                return "ERROR"
        if k in cls["NS"]:
            if not isinstance(v, list):
                print("[ERROR] NS key {k} should have list value,value={v}")
                print("k", end=":")
                pprint(k)
                print("v", end=":")
                pprint(v)
                return "ERROR"
            else:
                for i, vv in enumerate(v):
                    checked_vv = JSON_FMT_checker(vv, *vtype["NS$" + k], nest_parent=nest_parent + ">" + k)
                    if checked_vv == "ERROR":
                        return "ERROR"
                    else:
                        v[i] = checked_vv
        else:
            try:
                if isinstance(v, list) and vtype[k] == "list":
                    pass
                elif isinstance(v, (int, float, str)) and vtype[k] == "chr":
                    pass
                elif isinstance(v, dict):
                    print("[ERROR] When using a dictionary as a value, you must request it as an NS.")
                    return "ERROR"
                else:
                    print("[ERROR] Value type is uncomfortable")
                    return "ERROR"
            except KeyError:  # 登録されていないkey
                pass
    for rq_key in cls["RQ"]:
        print("[ERROR]lack require keys")
        pprint(cls["RQ"])
        return "ERROR"
    # クレンジング
    for opk in cls["OP"]:
        if opk not in subj.keys():
            if opk in cls["NS"]:
                subj[opk] = JSON_FMT_checker({}, cls["NSchild"][cls["NS"].index(k)])
            elif vtype[opk] == "list":
                subj[opk] = []
            else:
                subj[opk] = ""
    return subj
if __name__ == "__main__":
    from pprint import pprint

    smp = r"C:\Users\Ariku\OneDrive\Documents\Nango\test_or_future\sample.json"
    mdl = r"C:\Users\Ariku\OneDrive\Documents\Nango\test_or_future\sampleFMT_checker.json"

    with open(smp, mode="r", encoding="utf-8") as smp_ld:
        with open(mdl, mode="r", encoding="utf-8") as mdl_ld:
            row_db = json.loads(smp_ld.read())
            subj = row_db["words"][0]
            key_class, value_types = imp_modelFMT(json.loads(mdl_ld.read()))
            adapted = JSON_FMT_checker(subj, key_class, value_types)
            adapted_json = json.dumps(adapted, sort_keys=0, ensure_ascii=False, indent=2)
            pprint(adapted_json)
