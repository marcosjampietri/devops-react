const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const bcryptjs = require("bcryptjs");
const user = require("../models/User");

dotenv.config({ path: "../.env" });

const testAPI = (req, res) => {
    res.send("API Working OK!");
};

const register = async function (req, res) {
    let { name, email, password } = req.body;

    const newUser = new user({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password,
    });

    newUser.password = await newUser.encryptPassword(newUser.password);

    const savedUser = await newUser.save();

    const token = jwt.sign(
        { _id: savedUser._id },
        process.env.JWT_TOKEN_SECRET
    );

    res.header("auth-token", token).json(savedUser);
};

const login = async function (req, res) {
    let { name, email, password } = req.body;

    const logUser = await user.findOne({ email });
    if (!logUser) return res.status(400).json("User doesn't exist");

    const matchPass = await logUser.validatePassword(req.body.password);
    if (!matchPass) return res.status(400).json("Invalid Email or Password");

    const token = jwt.sign({ _id: logUser._id }, process.env.JWT_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: 60 * 60 * 24,
    });

    res.send(`Welcome, ${name}`);
};

const getUser = async (req, res, next) => {
    const profile = await user.findById(req.userID, { password: 0 });
    if (!profile) return res.status(404).json("User not found");
    res.json(profile);
};

const getAllUsers = (req, res) => {
    user.find()
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error,
            });
        });
};

module.exports = { register, getAllUsers, testAPI, login, getUser };
