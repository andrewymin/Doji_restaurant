import json
from flask import Flask, render_template, flash, url_for, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
import os
import stripe

# from file_convert import Menu

app = Flask(__name__)
# Creating secret key for sessions
# SECRET_KEY = os.environ.get("secret_key")
# app.config['SECRET_KEY'] = SECRET_KEY

app.config['STRIPE_PUBLIC_KEY'] = os.environ.get('pk_test')
app.config['STRIPE_SECRET_KEY'] = os.environ.get('sk_test')
stripe.api_key = app.config['STRIPE_SECRET_KEY']

# Connect to Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///menu.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

menu = db.Table('menu', db.metadata, autoload=True, autoload_with=db.engine)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/all_day', methods=["GET", "POST"])
def day():
    # querying using db.session since not using model existing menu db
    results = db.session.query(menu).all()
    # querying table example for filter, thus need to query db than it
    # becomes a table object, from there filter by table name, c=column, column name
    # item_5 = db.session.query(menu).filter(menu.c.id == 109).one()
    # print(item_5)
    # if item_5[3]:
    #     pass
    return render_template('all_day_menu.html', menu=results)
    # return render_template('cart.html')


@app.route('/lunch', methods=["GET", "POST"])
def lunch():
    results = db.session.query(menu).all()
    return render_template('lunch_menu.html', menu=results)


@app.route("/modal", methods=['POST', 'GET'])
def modal():
    if request.method == 'POST':
        item_id = request.form['itemId']
        # print(item_id)
        item = db.session.query(menu).filter(menu.c.id == item_id).one()
        # print(item[7])
        return jsonify('', render_template('modal.html', item=item))


@app.route('/shopping_cart', methods=["POST", "GET"])
def cart():
    # Using this route to delete all items in the cart for testing purposes
    # later learn how to make this run after session is over
    # db.session.query(Cart).delete()
    # db.session.commit()
    item_list = []
    if request.method == 'POST':
        cart_json = json.loads(request.form['items'])
        if len(cart_json) != 0:
            for i in cart_json:
                item = db.session.query(menu).filter(menu.c.id == i['id']).one()
                item_id = item[0]
                item_name = item[2]
                quantity = i['quantity']
                position = i['position']
                if i["option"] is not None:
                    option = item[5]
                    price = item[6]
                else:
                    option = None
                    price = item[4]
                item_total = i['item_total']
                show_item = {
                    "position": position,
                    "id": item_id,
                    "item_name": item_name,
                    "quantity": quantity,
                    "option": option,
                    "price": price,
                    "item_total": item_total,
                    "maki_rolls": i['maki_rolls'],
                    "sos": i['sos'],
                }

                item_list.append(show_item)
            # print(item_list)
            # print(len(cart_json))
            # return "success"
            return jsonify({'item_response': render_template('cart_item.html', items=item_list)})
        return jsonify({'item_response': render_template('empty_cart.html')})
    return render_template('cart.html')


@app.route('/delete', methods=["POST"])
def delete():
    if request.method == 'POST':
        cart_json = json.loads(request.form['items'])
        if len(cart_json) != 0:
            return jsonify({'item_response': render_template('cart_item.html', items=cart_json)})
        return jsonify({'item_response': render_template('empty_cart.html')})


@app.route('/edit', methods=["POST"])
def edit():
    if request.method == 'POST':
        edit_item = json.loads(request.form['edit_item'])
        db_item = db.session.query(menu).filter(menu.c.id == edit_item['id']).one()
        price = db_item[4]
        if db_item[5] is not None:
            option = db_item[5]
            price2 = db_item[6]
        else:
            option = None
            price2 = None
        show_item = {"position": edit_item['position'],
                     "id": edit_item['id'],
                     "item_name": edit_item['item_name'],
                     "quantity": edit_item['quantity'],
                     "description": db_item[3],
                     "option": option,
                     "price": price,
                     "price2": price2,
                     "item_total": edit_item['item_total'],
                     "img": db_item[8],
                     "alt": db_item[9],
                     "sos": edit_item["sos"],
                     }
        # print(show_item)
        return jsonify('', render_template('edit.html', item=show_item))


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    if request.method == 'POST':
        cart_json = json.loads(request.form['items'])
        items = []
        # print(cart_json)
        for i in cart_json:
            db_item = db.session.query(menu).filter(menu.c.id == i['id']).one()
            description = ' '
            unit_price = int(db_item[4]*100)
            if i['option']:
                description = i['option'].replace(":", '').title()
                unit_price = int(db_item[6]*100)
            elif len(i['maki_rolls']) and i['sos']:
                rolls = ' '.join(i['maki_rolls'])
                description = f"{i['sos'].title()} with {rolls} rolls"
            elif i['sos']:
                description = i['sos'].title()
            item = {
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': db_item[2],
                        'description': description,
                    },
                    'unit_amount': unit_price,
                },
                'quantity': int(i['quantity']),
            }

            items.append(item)
        # print(items)
        # return jsonify('')
        session = stripe.checkout.Session.create(
            line_items=items,
            mode='payment',
            success_url=url_for('order_success', _external=True) + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=url_for('cart', _external=True),
        )
        return jsonify({'url': session.url})


@app.route('/order/success', methods=['GET'])
def order_success():
    session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
    customer = stripe.Customer.retrieve(session.customer)

    return render_template('success.html', name=customer.name)


if __name__ == "__main__":
    app.run(debug=True)
    # app.run()
