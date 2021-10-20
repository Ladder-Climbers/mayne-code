import xmnlp

xmnlp.set_model('../xmnlp-onnx-models')

with open("text.txt", "r", encoding='utf8') as f:
    text = f.read()

result = xmnlp.keyphrase(text, k=1)

sentiment = xmnlp.sentiment(result[0])

print(result, sentiment)
