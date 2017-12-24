---
layout:     post
title:      DataVis Stories - Designing a beautiful & Optimal road Trip around India
comments:   true
image:      http://www.natgeotraveller.in/site/assets/files/33437/harishmalabar_pit_viper.jpg
description: National geographic selected the destinations, I planned the shortest route to cover them all. Enjoy the journey, read and learn how to plan your optimal trip
date:       2015-09-22 22:50:00
summary:    Cover the beauty of India but optimally!!
categories: datavisualisation
thumbnail: suitcase
tags:
 - travel
 - india
 - states
 - optimal
 - traveling sales man
 - maps
 - visualisations
 - data
 - analysis
 - data is beautiful
 - natgeo
 - short trips
 - weekend
 - randal olson
---

<i class='fa fa-music'></i> **`Wake Me Up When September Ends`** <i class='fa fa-music'></i>

Its been a busy month, and also a month dedicated to Travel, not literally travel but at least reading and writing about it. My [previous post](http://quriousanalyst.com/datavisualisation/2015/09/14/A-traveller-within/) was about Indian states I have covered till now which is followed by yet another travel cum data science post. I must admit, I've learnt a lot since I started writing these blogs, maybe I'll dedicate a post on behind the scenes of every blog post I have written. It's a roller coaster ride full of learning, scraping, try, catch, debug and of course data.

Hmm!! *Travel & Data Science*, two things I love in this world. Let's start the journey fellows. 

> **Idea**

I am an avid reader of [NatGeo](http://www.natgeotraveller.in/) blogs and articles, superb writing with some superb locations with some super awesome photographs, what else you need. I was searching for some short escapes and came around the [Short Breaks](http://www.natgeotraveller.in/magazine/section/short-breaks/) section on there website. Again impressed by the collection these guys have, currently 55 surreal destinations across India you'll fall in love with.  But wait, 55 ?? seriously, when will I be able to cover each and every one of them. Even if I cover at-least three destinations in a year, it will take me close to 18 years which is far less as my capacity to travel will decrease with time. Let's drop the plan and go back to our monotonous lives. Wait!! We are analysts, how can we not come up with a solution to this *time and travel* problem. No way, lets fetch some data and see where we reach.

![Short Breaks](http://i.imgur.com/vAnV0bn.jpg)

>**Fetching Data**

Scraping data from [NatGeo's](http://www.natgeotraveller.in/) website was easy. I pulled all the 55 destinations along with their tags and links on the world wide web, geocoded the addresses with the help of Google Maps API and tried to visualise the destinations over the Indian Map. 

![Mapping the destinations](http://i.imgur.com/jDoli2t.png)

You can also have a look at the data [here](https://github.com/apoorv74/optimal-route/blob/master/pulled_data.csv). 

Ok, Now what!! I have the data, I have the locations, but coming back to where we started, how to **travel these beautiful locations and cover them as soon as possible**. This sounds familiar, at least to Computer Science guys, guessed it right, we have the **Travelling Salesman problem** at our hands fellows - *How to cover the given destinations using the shortest route possible*. Some progress, at least the problem is cleared, we'll figure how to approach this **NP hard** problem soon!!

> **Travelling Salesman 101**

In my journey of learning more about visualisations, I come across a lot of amazing people doing some great work in this field and [Randal Olson](https://twitter.com/randal_olson) is one of them. His [work](http://www.randalolson.com/) is amazing, and one of the reasons I am writing this post. I remembered, I have read his article  - [Computing the optimal road trip across the US](http://www.randalolson.com/2015/03/08/computing-the-optimal-road-trip-across-the-u-s/), mine had a similar use case. Let's see what the master has to say. 

According to him - *If you started computing this problem(TSP) on your home computer right now, you’d find the optimal route in about 9.64 x 1052 years — long after the Sun has entered its red giant phase and devoured the Earth.*

Ohh, great!! What now, **Genetic Algorithms** - yups, basically a smarter technique to find a solution that is good enough for our purpose. Not getting into much details (for a simple implementation and understanding of a Genetic Algorithm follow this [post](http://www.r-bloggers.com/genetic-algorithms-a-simple-r-example/)) lets move ahead. We have the data, we know the algorithm, let's start implementing it and get our optimal route for this mind blowing trip. Randall, explains the technique briefly and also has the code shared on [Github](https://github.com/rhiever/Data-Analysis-and-Machine-Learning-Projects/tree/master/optimal-road-trip). The code is written completely in Python and uses Javascript for visualisation. I have used a combination of R, Python and Java Script for this problem. You can find the respective codes [here](https://github.com/apoorv74/optimal-route/tree/master/code).

>**Result**

Amazed!! The program started with 57K KM's and ended computing the total distance as 10K KM's traversing each and every destination. 55 destinations looked a mighty, 10K KM looks easy. Data Scientist at work fellows :).  Have a look at the route below, 10000 KM's of paradise.

![The optimal route!!](http://i.imgur.com/prYzuhC.png)

Play with an interactive version [here](https://rawgit.com/apoorv74/apoorv74.github.io/master/major-landmarks.html).

>**Here is the list of destinations in order**

1. [Bal Samand's verdure could inspire poets.](http://www.natgeotraveller.in/magazine/month/february-2015/bal-samand/)
2. [Churu's locked havelis reveal dazzling art.](http://www.natgeotraveller.in/magazine/month/january-2014/mansions-and-markets-36/)
3. [At this boutique resort, the only signal you'll receive is the call of the mountains waiting to be explored.](http://www.natgeotraveller.in/magazine/month/september-2015/the-villa-himalaya-jammu-kashmir/)
4. [Rekindling idyllic vacations in Kashmir.](http://www.natgeotraveller.in/magazine/month/may-2015/gulmarg/)
5. [A B&B holiday with the Dhauladhars for company.](http://www.natgeotraveller.in/magazine/month/march-2015/stay-mirage/)
6. [Trekking, fishing and driving around this little-known town.](http://www.natgeotraveller.in/magazine/month/march-2015/barot/)
7. [Far from the chaos of Manali town, The Himalayan is like a plush man cave.](http://www.natgeotraveller.in/magazine/month/september-2014/mountain-manor--the-himalayan-in-manali-355/)
8. [Despite its proximity to manic Mussoorie, this town retains its old-world aura. ](http://www.natgeotraveller.in/magazine/month/july-2015/weekend-getaway-head-to-landour-ruskin-bonds-hometown/)
9. [Dehradun is an Enid Blyton storybook come alive.](http://www.natgeotraveller.in/magazine/month/april-2015/doon-valleys-hidden-delights/)
10. [The hotel is about wellbeing and turning the focus inward.](http://www.natgeotraveller.in/magazine/month/september-2015/ananda-in-the-himalayas-uttarakhand/)
11. [Explore the secrets of this beautiful hill station.](http://www.natgeotraveller.in/magazine/month/november-2014/garhwalis-ghosts-live-in-harmony-in-lansdowne/)
12. [Thrills, frills, and safari adventures in Uttarakhand.](http://www.natgeotraveller.in/magazine/month/july-2015/jims-jungle-retreat-corbett-national-park/)
13. [Enjoying the healing powers of a spectacular view.](http://www.natgeotraveller.in/magazine/month/august-2015/itmenaan-estate-uttarakhand/)
14. [Serenity and luxury in the Kumaon hills.](http://www.natgeotraveller.in/magazine/month/june-2015/te-aroha/)
15. [Temples, forts and shopping.](http://www.natgeotraveller.in/magazine/month/august-2013/short-break-gwalior/)
16. [The spirit of indulgence still dances among the relics of this town in Madhya Pradesh.](http://www.natgeotraveller.in/magazine/month/december-2014/cycle-through-ruins-of-the-empires-in-mandu/)
17. [Following Rabindranath Tagore's inspiration in a rural paradise.](http://www.natgeotraveller.in/magazine/month/june-2014/shantiniketan-by-the-book-307/)
18. [Despite a surfeit of tourists, Gokarna has aged well.](http://www.natgeotraveller.in/magazine/month/may-2014/beach-mantra-120/)
19. [Hello Goodbye, it's a Beatles-themed hotel.](http://www.natgeotraveller.in/magazine/month/june-2015/revolver/)
20. [Elephant rides, jeep safaris and boat safaris in the wild.](http://www.natgeotraveller.in/magazine/month/october-2012/the-wild-way/)
21. [The Jagannath Temple defines the spirit of the holy town of Puri.](http://www.natgeotraveller.in/magazine/month/april-2014/juggernautjourney-164/)
22. [The Andhra town is home to the guru of Jayalalitha, Hema Malini and Rekha. ](http://www.natgeotraveller.in/magazine/month/february-2013/dance-trail-exploring-classical-art-and-culture-in-kuchipudi/)
23. [Compelling history, green spaces, & delicious food welcome you in this Tamil Nadu town.](http://www.natgeotraveller.in/magazine/month/january-2015/vellore/)
24. [This region in Tamil Nadu is packed with history and grandeur.](http://www.natgeotraveller.in/magazine/month/january-2013/chettinad-short-breaks/)
25. [Weekend getaway: There's something in these temples for everyone.](http://www.natgeotraveller.in/magazine/month/february-2015/kumbakonam/)
26. [Discovering rare books, opulent paintings, and dancing-girl dolls in Thanjavur.](http://www.natgeotraveller.in/magazine/month/august-2014/in-the-shadow-of-the-temple-276/)
27. [A local rose-flavoured drink and the native jasmine will enhance your cultural exploration of Madurai.](http://www.natgeotraveller.in/magazine/month/october-2014/guided-by-the-goddess-four-ways-to-explore-madurai/)
28. [Stunning views, flocks of cuddly sheep, smoked garlic that's what Kodaikanal is about.](http://www.natgeotraveller.in/magazine/month/july-2014/the-joy-of-small-things-254/)
29. [Four ways to explore the Kerala beach town.](http://www.natgeotraveller.in/magazine/month/june-2015/kovalam/)
30. [This island getaway borrows heavily from the traditional Kerala homestead.](http://www.natgeotraveller.in/magazine/month/january-2014/soma-kerala-palace-kochi/)
31. [In Fort Kochi's oldest street, a snug, historical home.](http://www.natgeotraveller.in/magazine/month/july-2015/waltons-homestay-fort-kochi/)
32. [Travel back in time at the 100-year-old Sinna Dorai Bungalow.](http://www.natgeotraveller.in/magazine/month/august-2013/short-break-sinna-dorai/)
33. [Plus Kotagiri's hiking trails, churches and waterfalls.](http://www.natgeotraveller.in/magazine/month/october-2013/explore-the-nilgiris-through-ootys-botanical-gardens-and-tea-estates/)
34. [Hoysala grandeur comes alive in the temple carvings of Belur and Halebid.](http://www.natgeotraveller.in/magazine/month/february-2014/chronicles-in-stone-148/)
35. [Sakleshpur offers a year-round escape for the city-weary.](http://www.natgeotraveller.in/magazine/month/august-2013/hillside-haven/)
36. [Back to basics at this homestay in Arasinamakki.](http://www.natgeotraveller.in/magazine/month/august-2012/stream-of-joy/)
37. [Kerala's northernmost district makes for a great weekend getaway.](http://www.natgeotraveller.in/magazine/month/march-2013/unseen-sands/)
38. [The lush village lies in a Unesco World Heritage site.](http://www.natgeotraveller.in/magazine/month/october-2012/agumbe-rainforest-karnataka-western-ghats/)
39. [An active break in Bhatkal. ](http://www.natgeotraveller.in/magazine/month/august-2015/forest-trails-temple-ruins-and-luscious-mangalorean-food-in-coastal-karnataka/)
40. [An idyllic weekend getaway in Karnataka.](http://www.natgeotraveller.in/magazine/month/june-2013/honnemaradu/)
41. [A slice of life in a Goan village.](http://www.natgeotraveller.in/magazine/month/july-2013/only-olive/)
42. [Old-world charm and pineapple pickle in the sunshine state.](http://www.natgeotraveller.in/magazine/month/may-2015/goan-reverie/)
43. [At Capella, curl up with a book by a palm-fringed courtyard.](http://www.natgeotraveller.in/magazine/month/december-2014/browsers-nook/)
44. [Expect new hues every fortnight.](http://www.natgeotraveller.in/magazine/month/july-2012/monsoon-flower-fiesta-your-complete-guide-to-exploring-the-kaas-plateau/)
45. [Maharashtra's only heritage hotel built inside a fort.](http://www.natgeotraveller.in/magazine/month/june-2013/time-travelling-while-staying-at-fort-jadhavgadh/)
46. [Sa-i-Mika has cozy, no-frills rooms in one of the world's wettest landscape.](http://www.natgeotraveller.in/magazine/month/august-2013/rustic-in-the-rain/)
47. [The eco-resort makes for an artsy weekend getaway from Mumbai.](http://www.natgeotraveller.in/magazine/month/july-2013/avanti-kalagram-maharashtra/)
48. [Go white water rafting, birding, hiking or just relax.](http://www.natgeotraveller.in/magazine/month/november-2013/monsoon-getaway-explore-the-natural-beauty-of-mulshi-lake-near-pune/)
49. [Weekend Getaway: Rest and relaxation are unavoidable in this rural retreat. ](http://www.natgeotraveller.in/magazine/month/january-2013/hidden-village/)
50. [Skip Rajkot for Jamnagar's snacks and surmo.](http://www.natgeotraveller.in/magazine/month/march-2014/small-city-big-prize-85/)
51. [Baroque palaces meet the bare beauty of the White Rann in Bhuj.](http://www.natgeotraveller.in/magazine/month/september-2014/across-the-salt-desert-354/)
52. [A restored Ahmedabad haveli embraces its neighbourhood. ](http://www.natgeotraveller.in/magazine/month/april-2015/french-haveli/)
53. [Luxury tents in a rustic setting near Sariska National Park.](http://www.natgeotraveller.in/magazine/month/march-2015/vanaashrya/)
54. [The "city of dawn" will make your spirits soar.](http://www.natgeotraveller.in/magazine/month/may-2015/regal-romance/)
55. [Love for the desert and comfort coalesce.](http://www.natgeotraveller.in/magazine/month/august-2015/suryagarh-rajasthan/)
 
The best part is this algorithm works just as well when you’re planning a smaller trip within your state as when you’re planning a larger trip spanning the entire world. All the algorithm needs are the distances travelled between every stop so it can compute the optimal route. How you get between those stops is up to you.

> *With the help of some machine learning algorithms, I managed to move this list to my bucket list. Plan a trip, apply the algorithm, find an optimal path and most importantly, enjoy your vacation. I should now write less about data and more about my experience while covering these amazing places.*


----------

>Data scraped from [Natgeo](http://www.natgeotraveller.in/)
Except where otherwise noted, content on this site is licensed under a [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/). 
