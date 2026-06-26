import json

jsonT=open(r"C:\Users\Ariku\OneDrive\Documents\Nango\test_or_future\sample.json"
            ,mode="r"
            ,encoding="utf-8"
            ).read()

jsonT_decoded=json.loads(jsonT)
print(jsonT_decoded)

enc_tst=["abc",1,1.0,["1","a"],{"k":"v"}]
enc_ded=json.dumps(enc_tst)
print("enc_ded",enc_ded)
enc_dec=json.loads(enc_ded)
print("enc_dec",enc_dec)