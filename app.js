/* -------------------------------------   ECOHUB app.js  ------------------------------------------------*/

/* This is the mail file which: 
	1. Acts as server.
	2. Takes get, post requests.
	3. Renders pages accordingly.
*/

/* Express is a third party nodejs backend module which helps in routing, designing web applications */
const express = require('express');

/* Path module provides a way with working with files and directories easily. */
const path = require("path");


// Nodemailer is used to send mails from app.js to given mail address
const nodemailer = require("nodemailer")

// Passport is used for authentication in app.js
let passport = require("passport");
let passportLocalMongoose = require("passport-local-mongoose");

// Body Parser is a middleware and used to process HTTP request -> post requests by making it into JSON format
let bodyParser = require("body-parser");


/* Making an instance 'app' of the class express to use down futher*/
const app = express();

// Configuring it to use bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
	secret: "node js mongodb",
	resave: false,
	saveUninitialized: false
}));

/* Importing the Schema from the models section */

/*
	User for user Details
	Admin for Admin Details
	Message for having type of message and message content from contact us, other forms
	Product for having electric product details 
	VehFull and VehSmall for dynamically importing details for Vehicles
*/

const User = require('./models/user');
const Admin = require('./models/admin');
const Message = require('./models/message');
const Product = require("./models/productDetails");
const VehFull = require("./models/vehicle-full");
const VehSmall = require("./models/vehicle-small");
const mongoose = require('mongoose');
/*  Mongoose library used to creates a connection '
between MongoDB and the Express web application framework   */

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


/* This defaults to the views directory in the application root directory. 
view engine -> the template engine to use.*/

app.set("view engine", "ejs")

/* Connecting the path.join to make relative path (in file) to absolute (actual path) */
app.set('views', path.join(__dirname, 'views'));

/* Making the app use the public folder as they are static */
app.use(express.static("public"));

/* Parsing url encoded data */
app.use(express.urlencoded({
	extended: true
}))

/* Connecting database here 
	1. DBurl is the url of the database ECOHUB and user and vehsmall is the schema
	2. Connect the DBurl with mongoose.connect()
	3. If the connetion is successful, printing Connected to Database
	4. Then listen to the requests of the localhost on the port number 3000
	5. If error, print the error.
*/
const DBurl = "mongodb+srv://KarthikD:karthik123@ecohub.isryz.mongodb.net/ECOHUB?retryWrites=true&w=majority";
mongoose.connect(DBurl).then(() => {
	console.log("Connected to Database");
	console.log("Waiting for login  /   register ...............");
	const port = process.env.PORT || 5000;
	app.listen(port);
}).catch((err) => {
	console.log(err)
	console.log("OOPS! Bad Credentials");
}
)

// This is the home page (Without Login)
app.get("/", (req, res) => {
	res.render("index")
})


/* 
	Making this user = null because:
	1. If the user logins using his credentials, the user retrieved from the database will be assigned to this user
	2. (or) if the user registers, we make a new user then and there and assign it to this user and user this user for futher purposes.

	Same for mongoUser and admin
*/

let user = null;
let mongoUser = null;
let admin = null;


// ---------------------------------------------	NODEMAILER SECTION ---------------------------------------------------

// Transporter details
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ecohub69@gmail.com',
		pass: 'ecohub@20'
	}
});

email = 'ecohub69@gmail.com';
let subject = "This is an email from ECOHUB Dept.";

// Options details
let mailOptions = {
	from: 'ecohub69@gmail.com',
	to: email,
	subject: 'Temporary Email',
	text: "This is temporary email"
};

// Function to send Email for the given configuration of emails
function sendEmail() {
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

// ----------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------	ADMIN SECTION 	-----------------------------------------------------


// Encrypted code which are given for employees to access the admin page -> WBvYmCmC3WM3RQpyemibZ5xScyXqAA%3A1650803976633

app.get("/WBvYmCmC3WM3RQpyemibZ5xScyXqAA%3A1650803976633admin", (req, res) => {
	res.render("./admin/adminLogin")
})

app.get("/admin/home", (req, res) => {
	if (admin == null) {
		res.render("./admin/adminLogin")
	}
	else {
		User.find()
			.then((result) => {
				let userLength = result.length
				Product.find()
					.then((result2) => {
						let productLength = result2.length
						res.render("./admin/adminHome", { userLength, productLength })
					})
			})
	}
})

app.get("/admin/showusers", (req, res) => {
	if (admin == null) {
		res.render("./admin/adminLogin")
	}
	else {
		User.find()
			.then((result) => {
				Product.find()
					.then((result1) => {
						res.render("./admin/showUserData", { CustomerList: result, ProductList: result1 })
					})
			})
	}
})

app.get("/admin/deleteuser/:id", (req, res) => {
	if (admin == null) {
		res.render("./admin/adminLogin")
	}
	else {
		const id = req.params.id;
		console.log("received delete request for id:", id);
		User.findByIdAndRemove(id, (err) => {
			if (err) {
				console.log(err)
			}
			else {
				console.log("User has been removed");
				res.redirect("/admin/showusers");
			}
		});
	}
})

app.get("/admin/adduser", (req, res) => {
	if (admin == null) {
		res.render("./admin/adminLogin")
	}
	else {
		res.render("./admin/addUser");
	}

})

app.post("/admin/adduser", (req, res) => {
	if (admin == null) {
		res.render("./admin/adminLogin")
	}
	else {
		let imgURL = null;
		if (req.body.img_url == "") {
			imgURL = "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png";
		}
		else {
			imgURL = req.body.img_url;
		}
		// Making a new user from the request body
		user = new User({
			username: req.body.username,
			fullname: req.body.fullname,
			email: req.body.email,
			password: req.body.password,
			city: req.body.city,
			phone_number: req.body.phonenumber,
			address: req.body.address,
			gender: req.body.gender,
			img_url: imgURL,
			cart: []
		})

		//console.log(user);

		// User.find() gives me all the entries from the database and I will search from that.
		User.find()
			.then((result) => {
				// result contains all the users in the mongoDB database
				let count = 0;

				// if the email matches, that means the user has already registered
				result.forEach(element => {
					if (element.email == user.email) {
						count++;
					}
				});

				//console.log(count);

				// count == 0 implies this is a new user, hence I save the user into the database
				if (count == 0) {
					console.log(user.username, "has registered successfully -----");
					console.log("His details(from MongoDB) are: ");
					console.log(user);

					// This command saves the user into the database

					user.save();

					// Passing the user object for further pages -> To display details in the navbar of all pages
					res.redirect("/admin/showusers");
				}
				else {
					console.log("Email is already taken");
					user = null;
					res.render("failure-query", { data: "Email already exists! Please try again." });
				}
			})
	}
})

app.post('/admin', (req, res) => {
	let flag = 0;
	//finding the user
	Admin.find()
		.then((result) => {
			//console.log(result);
			//console.log(req.body.username, req.body.password)
			result.forEach(element => {
				//console.log(element)
				if (element.username == req.body.username) {
					flag = 1;
					if (element.password == req.body.password) {
						admin = {
							username: element.username,
							password: element.password
						}
						console.log("Admin entered successfully!")
						res.redirect("/admin/home");
					}
					else {
						console
						res.render("failure-query", { data: "Username matched, but password didn't, please try again!" })
					}
				}
			});
			if (flag == 0) {
				res.render("failure-query", { data: "Email has not matched, try again." });
			}
		})
		.catch((err) => {
			res.render("failure-query", { data: "Failed to log-in, please try again!" })
			console.log(err)
		})
})


app.post("/sm/message", (req, res) => {
	//console.log(req.body);
	let message = new Message({
		email: req.body.email,
		type: "Sales Manager Query",
		message: req.body.query
	})
	message.save()
	console.log("Message succesfully sent!");
	res.redirect("/home");
})

app.post("/ps/message", (req, res) => {
	let query = req.body.query + " (Unique ID: " + req.body.ID + ")";
	//console.log(req.body);
	let message = new Message({
		email: req.body.email,
		type: "Product Service Query",
		message: query
	})
	message.save()
	console.log("Message succesfully sent!");
	res.redirect("/home");
})

app.post("/con/message", (req, res) => {
	//console.log(req.body);
	let message = new Message({
		email: req.body.email,
		type: "Contact Us Query",
		message: req.body.subject
	})
	message.save()
	console.log("Message succesfully sent!");
	res.redirect("/home");
})

app.get("/admin/showallmessages", (req, res) => {
	Message.find()
		.then((result) => {
			res.render("./admin/messages", { ListOfMessages: result })
		})
})

app.post("/admin/msgdelete/:id", (req, res) => {
	const id = req.params.id;
	Message.findByIdAndDelete(id, (err) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log("Message with the ID:", id, "deleted!");
			res.redirect("/admin/showallmessages");
		}
	})
})


// From admin section, sending mails for all the user emails registered

app.get("/admin/send-all-mail", (req, res) => {
	if (admin == null) {
		res.render("/admin/home");
	}
	else {
		res.render("./admin/sendallMail")
	}
})


app.post("/admin/send-all-mail", (req, res) => {
	if (admin == null) {
		res.render("/admin//home");
	}
	else {
		User.find()
			.then((result) => {
				result.forEach(u => {
					mailOptions.subject = "Important Announcement"
					mailOptions.to = u.email;
					mailOptions.text = req.body.msg;
					sendEmail();
				});
				res.render("success-query", { data: "Mail sent to all users" })
			})
	}
})


// ----------------------------------------------------------------------------------------------------------------------


// -------------------------------------------	LOGIN / SIGNIN SECTION 	-------------------------------------------------
/*

Register works as:
	1. Making a new user from the post request recieved to the /register
	2. Retreving the user list from the database to check if the user has already registered with the email.
	3. If the email matches, print the error.
	4. If the user email is not matching with any email in the database, save the email 
	   in the database and use the generated 'user' into other files.

*/


//mail sections
function sendWelcomeMail() {
	mailOptions.to = user.email;
	mailOptions.subject = "ECOHUB Welcoming Mail";
	let mes = "Hi there, good to see you here. First off, welcome to ECOHUB! where you can find a wide range of products and services to awail. Make sure to contact at our email: ecohub69@gmail.com \nNone the less, we thrive to give you a pleasant experience.\n\n\nThank you.\nECOHUB";
	//console.log(mes);
	mailOptions.text = mes;
	sendEmail();
}

app.post("/register", (req, res) => {
	//console.log(req.body);
	let imgURL = null;
	if (req.body.img_url == "") {
		imgURL = "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png";
	}
	else {
		imgURL = req.body.img_url;
	}
	// Making a new user from the request body
	user = new User({
		username: req.body.username,
		fullname: req.body.fullname,
		email: req.body.email,
		password: req.body.password,
		city: req.body.city,
		address: req.body.address,
		gender: req.body.gender,
		phone_number: req.body.phonenumber,
		img_url: imgURL,
		cart: []
	})
	mongoUser = user
	//console.log(user);

	// User.find() gives me all the entries from the database and I will search from that.
	User.find()
		.then((result) => {
			// result contains all the users in the mongoDB database
			let count = 0;

			// if the email matches, that means the user has already registered
			result.forEach(element => {
				if (element.email == user.email) {
					count++;
				}
			});

			//console.log(count);

			// count == 0 implies this is a new user, hence I save the user into the database
			if (count == 0) {
				console.log(user.username, "has registered successfully -----");
				console.log("His details(from MongoDB) are: ");
				//console.log(user);

				// This command saves the user into the database

				user.save();
				

				sendWelcomeMail();
				// Passing the user object for further pages -> To display details in the navbar of all pages
				res.render("home", { user });
			}
			else {
				console.log("Email is already taken");
				user = null;
				res.render("failure-query", { data: "Email already exists! Please try again." });
			}
		})
})

/*

Signin works as:
	1. Takes the post request from /signin after filling in the details.
	2. Retrieves the list of users from the database by User.find()
	3. And in the result, we compare with each element with the details 
	   from the request body and check if the email and password is matching or not.
	4. If matches, the user will now be used for the other ejs files.
	5. If error, print the same.

*/


app.post('/signin', (req, res) => {
	let flag = 0;
	user = null
	//finding the user
	User.find()
		.then((result) => {
			//console.log(result);
			result.forEach(element => {
				if (element.email == req.body.email) {
					flag = 1;
					if (element.password == req.body.password) {
						// make an user and pass into the rest
						/* 
						user = User({
							username: element.username,
							fullname: element.fullname,
							email: element.email,
							password: element.password,
							img_url: element.img_url,
							cart: element.cart,
							id : element.id
						}) 
						*/
						user = {
							username: element.username,
							fullname: element.fullname,
							email: element.email,
							password: element.password,
							img_url: element.img_url,
							city: element.city,
							phone_number: element.phone_number,
							address: element.address,
							gender: element.gender,
							cart: element.cart
						}
						mongoUser = element;
						//console.log(mongoUser);
						console.log("User with the username:", user.username, " has logged in succesfully -------");
						res.render('home', { user });
					}
					else {
						console
						res.render("failure-query", { data: "Email matched, but password didn't, please try again!" })
					}
				}
			});
			if (flag == 0) {
				res.render("failure-query", { data: "Email has not matched, try again." });
			}
		})
		.catch((err) => {
			res.render("failure-query", { data: "Failed to log-in, please try again!" })
			console.log(err)
		})
})


// ----------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------	ROUTING SECTION 	-------------------------------------------------


/* All the get request starts here: ---------------------------- */

app.get("/home", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("home", { user }); }

})

// Populating products from Product Model and storing it in listofProd

let listofProd = [];
Product.find()
	.then((result) => {
		//console.log(result)
		result.forEach(product => {
			//console.log(product)
			let p = {
				name: product.name,
				a_price: product.a_price,
				d_price: product.d_price,
				img_link: product.img_link,
				id: product._id
			}
			listofProd.push(p);
		});
		//console.log(listofProd)
	})

app.get("/electric-products", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		res.render("ListofProj", { list: listofProd, user: user });
	}
})

/* 
	Add to Cart functionality -> 
	Firstly making a set from locally saved user.cart and then adding the product ID to the Set
	Then making the set back to array and assigning it back to user.cart
	This ensures that there is only one unique ID entry for each product
	And then MongoDB entry is updated, but simply finding by ID and then updating the array to user.cart
*/

app.get("/electric-products/:id", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		const id = req.params.id;
		Product.findById(id)
			.then(() => {
				let count = 0;
				let tempSet = new Set(user.cart);
				(user.cart).forEach(product => {
					console.log(product);
					if (product._id == id) {
						count++;
					}
				});
				//console.log(count);
				if (count == 0) {
					tempSet.add(id);
					user.cart = Array.from(tempSet);
					console.log(user.cart);
					User.findOneAndUpdate({ email: user.email }, {
						cart: user.cart
					}, (err) => {
						console.log(err);
					})
					console.log("Product has been added into cart");
					console.log(user);
					res.redirect("/show-cart");
				}
				else {
					console.log("Product is already in cart.");
					user = null;
					res.render("failure-query", { data: "Product is already in cart." });
				}
			})
	}
})

app.get("/FAQ", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("faq", { user }) }

})

app.get("/LoginPage", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("loginPage", { user }) }

})

app.get("/about", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("about.ejs", { user }) }

})

app.get("/contact-sales-manager", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("ContactSM.ejs", { user }) }

})

app.get("/success-query", (req, res) => {
	res.render("success-query.ejs", { data: "Your request has been succesfully done" })
})

app.get("/success-cm-req", (req, res) => {
	res.render("success-query.ejs", { data: "You request for cab has been approved, check your mail and phone number." })
})

app.get("/failure-query", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("failure-query.ejs") }

})

app.get("/articles", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("article.ejs", { user }) }

})


app.get("/product-service", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("product-service.ejs", { user }) }

})

app.get("/register", (req, res) => {
	res.render("register.ejs")
})

app.get("/success-mail", (req, res) => {
	res.render("success-query", { data: "Email has been sent succesfully!" })
})

app.get("/signin", (req, res) => {
	res.render("signin.ejs")
})

app.get("/ev-list", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("ev-list.ejs", { user }) }

})

app.get("/success-product-query", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("success-query", { data: "Your query about your product has been succesfully received, please check your email" }) }

})

app.get("/cab-service", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("cabService.ejs", { user }) }

})

app.get("/cab-service-success", (req, res) => {
	res.render("success-query.ejs", { data: "Your request for cab has been approved, check your mail and registered phone number." })
})


// ----------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------	CART ROUTING SECTION 	----------------------------------------------

app.get("/show-cart", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		if (user.cart.length == 0) {
			res.render("emptycart", { user });
		}
		else {
			let products = [];
			Product.find()
				.then((result) => {
					let finalCart = user.cart;
					//console.log(result);
					for (let j = 0; j < result.length; j++) {
						for (let k = 0; k < finalCart.length; k++) {
							if (result[j]._id == finalCart[k]) {
								// let p = {
								// 	name : result[j].name,
								// 	d_price : result[j].d_price,
								// 	img_link : result[j].img_link
								// }
								products.push(result[j]);
							}
						}
					}
					console.log("\n", user.username, "'s cart contents are: ");
					if (products.length == 0) {
						console.log("---empty---")
					}
					else {
						products.forEach(p => {
							console.log(p.name);
						});
					}
					console.log(products);
					res.render("cart.ejs", { user, products })
				})
		}
	}
})

app.get("/emptythecart", (req, res) => {
	user.cart = [];
	//mongo
	User.findByIdAndUpdate(mongoUser._id, {
		cart: []
	})
	console.log(user.cart);
	console.log("Cart has been empties! Happy Shopping!");
	res.redirect("/show-cart");
})

app.get("/remfromcart/:id", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		const id = req.params.id;
		let tempArray = (user.cart);
		console.log(tempArray);
		for (let i = 0; i < tempArray.length; i++) {
			if (tempArray[i] == id) {
				tempArray.splice(i, 1);
			}
		}

		User.findOneAndUpdate({ email: user.email }, {
			$pull: {
				cart: id
			}
		}, (err) => {
			console.log(err);
		})

		user.cart = tempArray;
		console.log(user.cart);
		console.log(id, "deleted succesfully");
		res.redirect("/show-cart");
	}
})



// ----------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------	USER PROFILE SECTION 	----------------------------------------------


app.get("/user-profile", (req, res) => {
	if (user == null) {
		res.render("register");
	} else { res.render("user-profile", { user }); }

})

app.get("/update-profile", (req, res) => {
	if (user == null) {
		res.render("register");
	}
	else {
		res.render("update-profile", { user })
	}
})

app.post("/update-profile", (req, res) => {
	if (user == null) {
		res.render("register");
	}
	//console.log("in updation")
	User.findByIdAndUpdate(mongoUser._id, {
		username: req.body.username,
		fullname: req.body.fullname,
		password: req.body.password,
		city: req.body.city,
		phone_number: req.body.phonenumber,
		address: req.body.address,
		gender: req.body.gender,
		img_url: req.body.link,
	})
		.then(() => {
			user.username = req.body.username;
			user.fullname = req.body.fullname;
			user.password = req.body.password;
			user.city = req.body.city;
			user.phone_number = req.body.phonenumber;
			user.address = req.body.address;
			user.gender = req.body.gender;
			user.img_url = req.body.link;
			res.redirect("/user-profile")
		})
})

// ----------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------	VEHICLE SECTION 	-------------------------------------------------

/* 
	To store the details for the vehicle-mini page, 
	I have made car objects of CarDetailsMini class and then save them into the database 
*/

class CarDetailsMini {
	constructor(title, img_link, range, speed, max_speed, p_power, expand_link) {
		this.title = title;
		this.range = range;
		this.img_link = img_link;
		this.speed = speed;
		this.max_speed = max_speed;
		this.p_power = p_power;
		this.expand_link = expand_link;
	}
}

// This is a list to store cars.
let listofCars = [];

// Generating Cars
const car1 = new CarDetailsMini("Tata Nexon", "https://cars.tatamotors.com/images/nexon/brochures/img4_1280_800.png", "2.42", "1.85", "300", "1020", "/tata-nexon");
const car2 = new CarDetailsMini("Mahindra E20 Plus", "https://blog.gaadikey.com/wp-content/uploads/2016/10/Mahindra-e2oPlus-Rear-Photos.jpg", "3.91", "1.96", "230", "1050", "/mahindra-e20-plus");
const car3 = new CarDetailsMini("Benz EQS", "https://w0.peakpx.com/wallpaper/120/475/HD-wallpaper-2022-mercedes-benz-eqs-580-4matic-amg-line-edition-1-color-high-tech-silver-obsidian-black-headlight-car.jpg", "3.91", "1.96", "150", "1080", "/benz-eqs");
const car4 = new CarDetailsMini("Volvo SC 40", "https://wallpapercave.com/wp/wp4780199.jpg", "3.91", "1.96", "220", "1060", "/xc40-recharge");

// Pushing cars into the list
listofCars.push(car1);
listofCars.push(car2);
listofCars.push(car3);
listofCars.push(car4);

/* Handy comment to add a new car*/
//listofCars.push(new CarDetailsMini())


/* This address takes the listofVehicles and with that list,
makes a car object or vehSmall schema discussed in vehicle-small.js 
and then saves it into the database ECOHUB */

app.get("/populate-vehmini", (req, res) => {
	listofCars.forEach(car => {
		const carDB = new VehSmall({
			title: car.title,
			range: car.range,
			speed: car.speed,
			max_speed: car.max_speed,
			p_power: car.p_power,
			img_link: car.img_link,
			expand_link: car.expand_link
		});
		carDB.save();
		console.log(carDB.title, " has been populated in the database");
	});
	res.render("/");
})


class CarDetailsFull {
	constructor(title, desc, img_link, brand, model, variant) {
		this.title = title;
		this.desc = desc;
		this.img_link = img_link;
		this.brand = brand;
		this.model = model;
		this.variant = variant;
	}
}


app.get("/tata-nexon", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehFull.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Tata Nexon") {
						let car = new CarDetailsFull(ele.title, ele.desc, ele.img_link, ele.brand, ele.model, ele.variant);
						console.log("The car details retrieved are: ", car);
						res.render("cartemplate", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/mahindra-e20-plus", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehFull.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Mahindra E20 Plus") {
						let car = new CarDetailsFull(ele.title, ele.desc, ele.img_link, ele.brand, ele.model, ele.variant);
						console.log("The car details retrieved are: ", car);
						res.render("cartemplate", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/benz-eqs", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehFull.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Mercedes Benz EQS") {
						let car = new CarDetailsFull(ele.title, ele.desc, ele.img_link, ele.brand, ele.model, ele.variant);
						console.log("The car details retrieved are: ", car);
						res.render("cartemplate", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/xc40-recharge", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {

		VehFull.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Volvo XC 40") {
						let car = new CarDetailsFull(ele.title, ele.desc, ele.img_link, ele.brand, ele.model, ele.variant);
						console.log("The car details retrieved are: ", car);
						res.render("cartemplate", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/tata-nexon-less", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehSmall.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Tata Nexon") {
						let car = new CarDetailsMini(ele.title, ele.img_link, ele.range, ele.speed, ele.max_speed, ele.p_power, ele.expand_link);
						console.log("Car details (Mini) are: ", car);
						res.render("indi-car-mini.ejs", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
		// console.log(car.title, car.range);
		// res.render("indi-car-mini.ejs", car);
	}
})

app.get("/mahindra-e20-less", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehSmall.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Mahindra E20 Plus") {
						let car = new CarDetailsMini(ele.title, ele.img_link, ele.range, ele.speed, ele.max_speed, ele.p_power, ele.expand_link);
						console.log("Car details (Mini) are: ", car);
						res.render("indi-car-mini.ejs", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/benz-eqs-less", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehSmall.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Benz EQS") {
						let car = new CarDetailsMini(ele.title, ele.img_link, ele.range, ele.speed, ele.max_speed, ele.p_power, ele.expand_link);
						console.log("Car details (Mini) are: ", car);
						res.render("indi-car-mini.ejs", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

app.get("/xc40-recharge-less", (req, res) => {
	if (user == null) {
		res.render("register");
	} else {
		VehSmall.find()
			.then((result) => {
				result.forEach(ele => {
					if (ele.title == "Volvo SC 40") {
						let car = new CarDetailsMini(ele.title, ele.img_link, ele.range, ele.speed, ele.max_speed, ele.p_power, ele.expand_link);
						console.log("Car details (Mini) are: ", car);
						res.render("indi-car-mini.ejs", { car });
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.render("failure-query", { data: "Car you're trying to find isn't there" });
			})
	}
})

// ----------------------------------------------------------------------------------------------------------------------


// --------------------------------------------	HELPER ROUTING SECTION 	-------------------------------------------------

app.get("/under-const", (req, res) => {
	res.render("failure-query.ejs", { data: "This page is under construction, sorry! ;)" });
})

app.use((req, res) => {
	res.render("failure-query.ejs", { data: "OOPS! Something is wrong, try again later" });
})

// ----------------------------------------------------------------------------------------------------------------------



