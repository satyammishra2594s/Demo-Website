import { dishFallbacks } from './images.js';

// 96 sample dishes, with eight dishes in each of the twelve menu categories.
// Confirm dish recipes, allergens, dietary status and prices with the restaurant before launch.
const groups = [
  ['Starters (Veg)', [
    ['Paneer Tikka','Char-grilled cottage cheese, hung curd and hand-ground spices.',289,2,'Chef’s Special',true],
    ['Dahi Ke Kebab','Silky hung-curd kebabs with herbs and a crisp golden crust.',249,1,'Bestseller',true],
    ['Hara Bhara Kebab','Spinach, peas and garden herbs shaped into delicate patties.',219,1,'',true],
    ['Crispy Corn','Sweet corn tossed with chilli, lime and a lively spice mix.',199,2,'Bestseller',true],
    ['Malai Broccoli','Tender broccoli in a creamy cashew and cheese marinade.',279,1,'',true],
    ['Tandoori Mushroom','Button mushrooms smoked in the clay oven with fresh masala.',259,2,'',true],
    ['Veg Seekh Kebab','Seasonal vegetables and paneer, gently charred over coals.',239,2,'',true],
    ['Stuffed Aloo Tikki','Crisp potato patties with a warmly spiced lentil centre.',189,1,'',true]
  ]],
  ['Starters (Non-Veg)', [
    ['Chicken 65','Crisp southern-style chicken with curry leaves and green chilli.',329,3,'Bestseller',false],
    ['Chicken Malai Tikka','Boneless chicken in a mellow cream, cheese and cardamom marinade.',369,1,'Chef’s Special',false],
    ['Murgh Seekh Kebab','Juicy minced chicken kebabs with mint and roasted spices.',349,2,'',false],
    ['Fish Amritsari','Crisp fish bites with ajwain, lemon and Punjabi seasoning.',379,2,'',false],
    ['Mutton Seekh Kebab','Smoky minced mutton skewers with a fragrant spice blend.',429,3,'',false],
    ['Chilli Chicken Dry','Wok-tossed chicken, peppers, spring onion and chilli.',339,3,'',false],
    ['Tandoori Chicken Wings','Clay-oven wings finished with a squeeze of fresh lime.',319,2,'',false],
    ['Prawn Pepper Fry','Succulent prawns tossed with cracked pepper and curry leaves.',449,3,'',false]
  ]],
  ['Tandoor', [
    ['Tandoori Chicken','Classic bone-in chicken, marinated overnight and clay-oven roasted.',429,2,'Bestseller',false],
    ['Afghani Chicken','Creamy, cashew-rich chicken with gentle smoke from the tandoor.',449,1,'Chef’s Special',false],
    ['Paneer Angara Tikka','Paneer cubes with a bold smoky tomato and chilli marinade.',329,3,'',true],
    ['Tandoori Prawns','Jumbo prawns with carom, garlic and a bright citrus finish.',499,2,'',false],
    ['Soya Chaap Malai','Tender soya chaap in a velvety cream and pepper marinade.',299,1,'',true],
    ['Tandoori Bharwan Aloo','Baby potatoes filled with spiced paneer and herbs.',269,2,'',true],
    ['Chicken Tangdi Kebab','Juicy chicken drumsticks with a robust house marinade.',399,2,'',false],
    ['Tandoori Platter','A generous chef’s selection of vegetarian tandoor favourites.',549,2,'Chef’s Special',true]
  ]],
  ['North Indian Mains', [
    ['Paneer Lababdar','Paneer in a rich tomato, cashew and kasuri methi gravy.',329,1,'Bestseller',true],
    ['Dal Makhani','Slow-simmered black lentils finished with butter and cream.',279,1,'Bestseller',true],
    ['Shahi Paneer','Soft paneer in a luxurious saffron and nut gravy.',319,1,'',true],
    ['Kadai Paneer','Paneer, peppers and crushed coriander in a kadai masala.',319,2,'',true],
    ['Butter Chicken','Tandoor chicken folded into a silky tomato-butter sauce.',389,1,'Chef’s Special',false],
    ['Chicken Tikka Masala','Charred chicken tikka in a spiced onion-tomato gravy.',399,2,'',false],
    ['Laal Maas','A Rajasthani-style mutton curry with deep, warming spices.',469,3,'',false],
    ['Palak Corn','Sweet corn and spinach in a comforting garlic tempering.',269,1,'',true]
  ]],
  ['South Indian', [
    ['Masala Dosa','Golden rice-lentil crepe with spiced potato and coconut chutney.',179,1,'Bestseller',true],
    ['Mysore Masala Dosa','Crisp dosa layered with a lively red chutney and potato masala.',199,2,'',true],
    ['Idli Sambar','Soft steamed rice cakes with homestyle sambar and chutneys.',139,1,'',true],
    ['Medu Vada','Crisp lentil doughnuts with coconut chutney and sambar.',149,1,'',true],
    ['Rava Onion Dosa','Lacy semolina dosa with onion, green chilli and cumin.',189,2,'',true],
    ['Paneer Uttapam','Soft rice pancake topped with paneer, tomato and onion.',199,1,'',true],
    ['Ghee Podi Idli','Bite-sized idlis tossed in ghee and fragrant podi.',169,2,'',true],
    ['Chettinad Chicken Curry','Peppery southern chicken curry with roasted coconut notes.',379,3,'Chef’s Special',false]
  ]],
  ['Indo-Chinese', [
    ['Veg Manchurian','Crisp vegetable dumplings in a glossy garlic-soy sauce.',229,2,'Bestseller',true],
    ['Chilli Paneer','Paneer tossed with peppers, onion and a punchy chilli sauce.',279,3,'',true],
    ['Hakka Noodles','Wok-fired noodles with crisp vegetables and spring onion.',219,2,'',true],
    ['Schezwan Fried Rice','Smoky wok-fried rice with house-made Schezwan sauce.',239,3,'',true],
    ['Chilli Garlic Mushroom','Mushrooms tossed in chilli, garlic and toasted sesame.',259,3,'',true],
    ['Chicken Manchurian','Tender chicken in a savoury ginger-garlic Manchurian glaze.',319,2,'',false],
    ['Chicken Fried Rice','Wok-fried rice with chicken, egg and fresh vegetables.',279,2,'',false],
    ['Crispy Honey Chilli Potato','Crunchy potato fingers with honey, sesame and chilli.',219,2,'',true]
  ]],
  ['Biryani and Rice', [
    ['Hyderabadi Veg Dum Biryani','Fragrant basmati layered with vegetables, herbs and saffron.',279,2,'Bestseller',true],
    ['Chicken Dum Biryani','Aromatic chicken biryani slow-cooked in a sealed handi.',359,2,'Chef’s Special',false],
    ['Mutton Dum Biryani','Tender mutton and aged basmati with whole warming spices.',429,3,'',false],
    ['Paneer Tikka Biryani','Smoky paneer, saffron rice and caramelised onions.',329,2,'',true],
    ['Jeera Rice','Fluffy basmati rice tempered with cumin and ghee.',159,1,'',true],
    ['Peas Pulao','Basmati rice with sweet green peas and whole spices.',179,1,'',true],
    ['Egg Biryani','Layered basmati with seasoned eggs, mint and fried onion.',279,2,'',false],
    ['Steamed Basmati Rice','Light, fragrant long-grain basmati rice.',129,1,'',true]
  ]],
  ['Breads', [
    ['Butter Naan','Soft tandoor naan brushed generously with butter.',69,1,'Bestseller',true],
    ['Garlic Naan','Tandoor naan topped with fresh garlic and coriander.',89,1,'',true],
    ['Tandoori Roti','Whole-wheat flatbread baked in the clay oven.',39,1,'',true],
    ['Lachha Paratha','Flaky, layered whole-wheat bread finished with ghee.',69,1,'',true],
    ['Missi Roti','Rustic gram-flour bread with herbs and warming spices.',59,1,'',true],
    ['Cheese Naan','Freshly baked naan with a rich cheese filling.',119,1,'',true],
    ['Pudina Paratha','Layered paratha with fresh mint and a touch of ghee.',79,1,'',true],
    ['Roomali Roti','Delicate handkerchief-thin bread, folded to order.',49,1,'',true]
  ]],
  ['Chaat and Street Food', [
    ['Dilli Wali Papdi Chaat','Crisp papdi, potato, cool yoghurt and tangy chutneys.',159,2,'Bestseller',true],
    ['Pani Puri','Golden puris with spiced potato and refreshing mint water.',99,3,'',true],
    ['Dahi Bhalla','Soft lentil dumplings topped with yoghurt and chutneys.',149,1,'',true],
    ['Aloo Tikki Chaat','Golden potato tikki with chickpeas, yoghurt and masala.',139,2,'',true],
    ['Raj Kachori','A generous crisp shell filled with lively chaat flavours.',179,2,'Chef’s Special',true],
    ['Pav Bhaji','Mumbai-style buttery bhaji with toasted pav and onion.',169,2,'',true],
    ['Samosa Chaat','Crisp samosas dressed with chickpeas and sweet-spicy chutney.',149,2,'',true],
    ['Kachori Chaat','Flaky kachori topped with potato, yoghurt and chutneys.',159,2,'',true]
  ]],
  ['Thali', [
    ['Classic Veg Thali','A balanced spread of seasonal sabzi, dal, rice, roti and dessert.',299,1,'Bestseller',true],
    ['Royal Rajasthani Thali','Dal baati inspired flavours, gatte, churma and accompaniments.',399,2,'Chef’s Special',true],
    ['Punjabi Thali','Comforting dal, paneer curry, seasonal veg, rice and breads.',349,1,'',true],
    ['South Indian Meals','Rice, sambar, rasam, poriyal, curd and traditional sides.',279,1,'',true],
    ['Mini Veg Thali','A lighter selection of daily vegetarian favourites.',229,1,'',true],
    ['Chicken Thali','Chicken curry, dal, rice, roti, salad and a sweet finish.',379,2,'',false],
    ['Mutton Thali','Slow-cooked mutton curry with rice, breads and accompaniments.',449,3,'',false],
    ['Executive Lunch Thali','A satisfying weekday-style meal with rotating specials.',259,1,'',true]
  ]],
  ['Desserts', [
    ['Gulab Jamun','Warm milk-solid dumplings soaked in cardamom sugar syrup.',99,1,'Bestseller',true],
    ['Rasmalai','Soft chenna rounds in chilled saffron and pistachio milk.',129,1,'',true],
    ['Kulfi Falooda','Traditional kulfi with rose falooda and sweet basil seeds.',159,1,'Chef’s Special',true],
    ['Gajar Ka Halwa','Slow-cooked carrots with milk, ghee and toasted nuts.',139,1,'',true],
    ['Moong Dal Halwa','Rich lentil halwa finished with dry fruits.',159,1,'',true],
    ['Shahi Tukda','Crisp bread, saffron rabri and a delicate nut garnish.',149,1,'',true],
    ['Rasmalai Tres Leches','A playful fusion dessert inspired by classic rasmalai.',179,1,'',true],
    ['Matka Kulfi','Creamy slow-reduced milk kulfi served in a clay pot.',119,1,'',true]
  ]],
  ['Beverages and Lassi', [
    ['Mango Lassi','Thick yoghurt blended with ripe mango and a hint of cardamom.',129,1,'Bestseller',true],
    ['Sweet Lassi','Classic chilled yoghurt drink, gently sweetened.',99,1,'',true],
    ['Salted Masala Chaas','Refreshing buttermilk with roasted cumin and herbs.',79,1,'',true],
    ['Rose Thandai','Chilled milk with rose, nuts and aromatic Indian spices.',139,1,'',true],
    ['Fresh Lime Soda','Fresh lime, sparkling soda and your choice of sweet or salted.',89,1,'',true],
    ['Jaljeera','A cooling tangy drink with mint and roasted cumin.',79,2,'',true],
    ['Masala Chai','Strong Indian tea simmered with ginger and warming spices.',59,1,'',true],
    ['Filter Coffee','South Indian filter coffee with a rich, frothy finish.',79,1,'',true]
  ]]
];
let nextId = 1;
export const categories = groups.map(([category]) => category);
export const menuItems = groups.flatMap(([category, dishes]) => dishes.map(([name, description, price, spice, tag, isVeg]) => ({
  id: nextId++, name, description, price, category, isVeg, spice,
  image: `/images/dish-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`, imageFallback: dishFallbacks[category], tags: tag ? [tag] : []
})));
export const signatureDishes = [menuItems[0], menuItems[9], menuItems[25], menuItems[49], menuItems[65]];
