from flask import Flask, request, jsonify

from ontobot.services import taxonomy_service

app = Flask(__name__)

# add new line
data = {}


@app.route('/onto/checkpoint_1/generate')
def get_ontos():
    return taxonomy_service.get_taxonomy_owl(data)


@app.route('/onto/checkpoint_1/validate', methods=['POST'])
def add_ontos():
    global data
    data = request.get_json()
    return taxonomy_service.validate_taxonomy_service(request.get_json())


if __name__ == "__main__":
    app.run()
