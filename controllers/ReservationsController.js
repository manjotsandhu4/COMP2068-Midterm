// You need to complete this controller with the required 7 actions
//Declaring Viewpath
const viewPath = 'reservations';

const Reservation = require('../models/reservation');

const User = require('../models/user');

const user = require('../models/user');

const { VirtualType } = require('mongoose');

exports.index = async (req, res) => {
    try{
        const reservations = await Reservation.find().populate('user').sort({updatedAt: 'desc'});

    //rendering response
    res.render(`${viewPath}/index`, {
        pageTitle: 'Your Reservations',
        reservations: reservations
    })
    }catch(error){
        //displaying error
        req.flash('danger', `Unfortunately, There was an error with your reservation: ${error}`);
        //redirecting to home page
        res.redirect('/');
    }
};
exports.show = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('user');
        console.log(reservation);

        res.render(`${viewPath}/show`, {
            pageTitle: reservation.roomType,
            reservation: reservation
        })
    } catch (error) {
        req.flash('danger', `Unfortunately, There was an error with your reservation: ${error}`);
        //redirecting to home 
        res.redirect('/');
    }
};
exports.new =  (req, res) => {

    const roomType = Reservation.schema.paths.roomType.enumValues;
    res.render(`${viewPath}/new`, {
        pageTitle: 'New Room Reservation',
        roomType: roomType
    });
};
exports.create = async (req, res) => {
    try {
        const { user: email} = req.session.passport;
        const user = await User.findOne({email: email});

        const reservation = await Reservation.create({user: user._id, ...req.body});
        
        //If success
        req.flash('success', 'The reservation update was a success!!!!');
        res.redirect(`/reservations/${reservation.id}`);
    } catch (error) {
        req.flash('danger', `Unfortunately, There was an error creating this reservation: ${error}`);
        
        //adding data from request body to session 
        req.session.formData = req.body;
        res.redirect('/reservations/new');
        
    }
    

};
exports.edit = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

    const roomType = Reservation.schema.paths.roomType.enumValues;

    res.render(`${viewPath}/edit`, {
        pageTitle: reservation.roomType,
        formData: reservation,
        roomType: roomType
    })
    } catch (error) {
        req.flash('danger', `Unfortunately, There was an error retrieving your reservation: ${error}`);
        res.redirect('/');
    }
};
exports.update = async (req, res) => {
    try {
        const {user: email} = req.session.passport;
        const user = await User.findOne({email: email});

        let reservation = await Reservation.findById(req.body.id);
        if(!reservation) throw new Error('Reservation requested cannot be found');
        
        const attributes = {user: user.id, ...req.body};
        await Reservation.Validate(attributes);
        await Reservation.findByIdAndUpdate(attributes.id, attributes);

        //if success
        req.flash('success', 'The reservation update was a success!!!!');
        res.redirect(`/reservations/${req.body.id}`);
    } catch (error) {
        req.flash('danger', `Unfortunately, There was an error updating this reservation: ${error}`);
        res.redirect(`/reservations/${req.body.id}`);
    }
};
exports.delete = async (req, res) => {
    try {
        await Reservation.deleteOne({_id: req.body.id});

        req.flash('success', 'The reservation was deleted successfuly!!!!');
        res.redirect('/reservations');
    } catch (error) {
        req.flash('danger', `Unfortunately, There was an error deleting this reservation: ${error}`);
        res.redirect('/reservations');
    }
};