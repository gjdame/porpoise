from flask import Flask, make_response, jsonify, Response, abort, render_template, redirect
from flask_github import GitHub
import os
from flask_cors import CORS
from dbs import storage
from loginmodel import UserCred

# I added CORS just in case -- may not need
cors = CORS(app, resources={r"/*": {"origins": "0.0.0.0"}})

app = Flask(__name__)
app.config['GITHUB_CLIENT_ID'] = 'c289d6463aee4a1f4fef'
app.config['GITHUB_CLIENT_SECRET'] = '989605368ed211c6f7472372c7c9111895d45eca'

# Pretty Print
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

# For GitHub Enterprise
app.config['GITHUB_BASE_URL'] = 'https://HOSTNAME/api/v3/'
app.config['GITHUB_AUTH_URL'] = 'https://HOSTNAME/login/oauth/'

github = GitHub(app)

@app.route('/login')
def login():
    return github.authorize()

@app.route('/github-callback')
@github.authorized_handler
def authorized(oauth_token):
    next_url = request.args.get('next') or url_for('index')
    if oauth_token is None:
        flash("Authorization failed.")
        return redirect(next_url)

    user = User.query.filter_by(github_access_token=oauth_token).first()
    if user is None:
        user = User(oauth_token)
        db_session.add(user)

    user.github_access_token = oauth_token
    db_session.commit()
    return redirect(next_url)

@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user.github_access_token

@app.route('/repo')
def repo():
    repo_dict = github.get('repos/cenkalti/github-flask')
    return str(repo_dict)