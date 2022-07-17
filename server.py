from flask import Flask, render_template, request, session, redirect, jsonify, flash
import util as pw
import data_handler as db

app = Flask(__name__)

app.secret_key = "12344321"


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        username = request.form['email']
        password = pw.hash_password(request.form['password'])
        isTaken = db.check_if_taken(username)
        if isTaken:
            flash('This username already exists, please choose another one')
            return redirect('/register')
        print(isTaken)
        db.save_registered_user(username, password)
        flash('Complete registration. Please log in')
        return redirect('/login')
    return render_template('register.html')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["user"]
        password = request.form["password"]
        try:
            hashed_password = db.get_hashed_password(username)['password']
        except:
            flash('Wrong username or password.')
            return redirect('/login')
        print(hashed_password)
        if pw.verify_password(request.form["password"], hashed_password):
            session['user'] = username
            return redirect('/')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop("user", None)
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
