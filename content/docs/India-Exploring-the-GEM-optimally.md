---
date: 2015-09-22T12:31:19+06:00
updated-on: 2017-10-13T15:19:19+06:00
title: Designing a beautiful & Optimal road Trip around India
authors: ["apoorv"]
categories:
  - Data visualisation
  - Algorithms
  - Data scraping
slug: optimal-trip
cover:
  image: /images/trip_RE.jpg
  caption: Photo by [Royal Enfield](https://royalenfield.com/re-world/campaigns/trip) 
  style: normal
---

##### Update: 
The article was well received by the [National Geographic Traveller India](http://www.natgeotraveller.in/) and they were kind enough to support it with a special tweet, a beautiful souvenir and an yearly subscription of the magazine. Thanks for this gesture guys, really appreciate it. 

{{<tweet 646578177851195392>}}


<i class='fa fa-music'></i> **`Wake Me Up When September Ends`** <i class='fa fa-music'></i>

Its been a busy month, and also a month dedicated to Travel, not literally travel but at least reading and writing about it.

*Travel & Data Science*, two things I love in this world. Let's start the journey fellows. 

##### Connecting the dots

I am an avid reader of [NatGeo](http://www.natgeotraveller.in/) blogs and articles, superb writing with some superb locations with some super awesome photographs, what else you need. I was searching for some short escapes and came around the Short Breaks section on there website. Again impressed by the collection these guys have, currently 55 surreal destinations across India you'll fall in love with.  But wait, 55 ?? seriously, when will I be able to cover each and every one of them. Even if I cover at-least three destinations in a year, it will take me close to 18 years which is far less as my capacity to travel will decrease with time. Let's drop the plan and go back to our monotonous lives. Wait!! We are analysts, how can we not come up with a solution to this *time and travel* problem. No way, lets fetch some data and see where we reach.

![Short Breaks](http://i.imgur.com/vAnV0bn.jpg)

##### Fetching Data

Scraping data from [NatGeo's](http://www.natgeotraveller.in/) website was easy. I pulled all the 55 destinations along with their tags and links on the world wide web, geocoded the addresses with the help of Google Maps API and tried to visualise the destinations over the Indian Map. 


<img src="/images/mapping_destinations.png" title="Mapping the destinations" />

Ok, Now what!! I have the data, I have the locations, but coming back to where we started, how to **travel these beautiful locations and cover them as soon as possible**. This sounds familiar, at least to Computer Science guys, guessed it right, we have the **Travelling Salesman problem** at our hands fellows - *How to cover the given destinations using the shortest route possible*. Some progress, at least the problem is cleared, we'll figure how to approach this **NP hard** problem soon!!

##### Travelling Salesman 101

In my journey of learning more about visualisations, I come across a lot of amazing people doing some great work in this field and [Randal Olson](https://twitter.com/randal_olson) is one of them. His [work](http://www.randalolson.com/) is amazing, and one of the reasons I am writing this post. I remembered, I have read his article  - [Computing the optimal road trip across the US](http://www.randalolson.com/2015/03/08/computing-the-optimal-road-trip-across-the-u-s/), mine had a similar use case. Let's see what the master has to say. 

According to him - *If you started computing this problem(TSP) on your home computer right now, you’d find the optimal route in about 9.64 x 1052 years — long after the Sun has entered its red giant phase and devoured the Earth.*

Ohh, great!! What now, **Genetic Algorithms** - yups, basically a smarter technique to find a solution that is good enough for our purpose. Not getting into much details (for a simple implementation and understanding of a Genetic Algorithm follow this [post](http://www.r-bloggers.com/genetic-algorithms-a-simple-r-example/)) lets move ahead. We have the data, we know the algorithm, let's start implementing it and get our optimal route for this mind blowing trip. Randall, explains the technique briefly and also has the code shared on [Github](https://github.com/rhiever/Data-Analysis-and-Machine-Learning-Projects/tree/master/optimal-road-trip). The code is written completely in Python and uses Javascript for visualisation. I have used a combination of R, Python and Java Script for this problem. You can find the respective codes [here](https://github.com/apoorv74/optimal-route/tree/master/code).

##### Result

Amazed!! The program started with 57K KM's and ended computing the total distance as 10K KM's traversing each and every destination. 55 destinations looked a mighty, 10K KM looks easy. Data Scientist at work fellows :).  Have a look at the route below, 10000 KM's of paradise.

<img src="/images/the-optimal-route.png" title="The optimal route" />


##### Here is the list of destinations in order

1. [Bal Samand's verdure could inspire poets.](http://www.natgeotraveller.in/stay-bal-samand-rajasthan/)
2. [Churu's locked havelis reveal dazzling art.](http://www.natgeotraveller.in/churu-guide-painted-havelis-and-tantalising-markets-in-rajasthan/)
3. [At this boutique resort, the only signal you'll receive is the call of the mountains waiting to be explored.](http://www.natgeotraveller.in/stay-the-villa-himalaya-jammu-kashmir/)
4. [Rekindling idyllic vacations in Kashmir.](http://www.natgeotraveller.in/stay-khyber-himalayan-resort-and-spa-gulmarg/)
5. [A B&B holiday with the Dhauladhars for company.](http://www.natgeotraveller.in/mountain-getaway-the-mirage-himachal-pradesh/)
6. [Trekking, fishing and driving around this little-known town.](http://www.natgeotraveller.in/barot-valley-guide-discover-natures-hidden-treasures-in-himachal-pradesh/)
7. [Far from the chaos of Manali town, The Himalayan is like a plush man cave.](http://www.natgeotraveller.in/mountain-stay-the-himalayan-in-manali/)
8. [Despite its proximity to manic Mussoorie, this town retains its old-world aura.](http://www.natgeotraveller.in/weekend-getaway-head-to-landour-ruskin-bonds-hometown/)
9. [Dehradun is an Enid Blyton storybook come alive.](http://www.natgeotraveller.in/quick-guide-four-ways-to-explore-dehradun/)
10. [The hotel is about wellbeing and turning the focus inward.](http://www.natgeotraveller.in/wellness-getaway-ananda-in-the-himalayas-uttarakhand/)
11. Explore the secrets of this beautiful hill station - (Post not linked)
12. [Thrills, frills, and safari adventures in Uttarakhand.](http://www.natgeotraveller.in/stay-jims-jungle-retreat-corbett-national-park/)
13. [Enjoying the healing powers of a spectacular view.](http://www.natgeotraveller.in/stay-itmenaan-estate-uttarakhand/)
14. [Serenity and luxury in the Kumaon hills.](http://www.natgeotraveller.in/stay-te-aroha-uttarakhand/)
15. [Temples, forts and shopping.](http://www.natgeotraveller.in/gwalior-guide-history-comes-alive-in-forts-tombs-and-palaces/)
16. [The spirit of indulgence still dances among the relics of this town in Madhya Pradesh.](http://www.natgeotraveller.in/mandu-guide-cycle-through-the-ruins-of-the-empires/)
17. [Following Rabindranath Tagore's inspiration in a rural paradise.](http://www.natgeotraveller.in/weekend-getaway-exploring-the-rural-paradise-of-tagores-shantiniketan/)
18. [Despite a surfeit of tourists, Gokarna has aged well.](http://www.natgeotraveller.in/gokarna-guide-pristine-beaches-ancient-temples-and-gadbad-ice-cream/)
19. [Hello Goodbye, it's a Beatles-themed hotel.](http://www.natgeotraveller.in/stay-revolver-darjeeling/)
20. [Elephant rides, jeep safaris and boat safaris in the wild.](http://www.natgeotraveller.in/kaziranga-guide-spot-the-endangered-one-horned-rhino/)
21. [The Jagannath Temple defines the spirit of the holy town of Puri.](http://www.natgeotraveller.in/puri-guide-exploring-sunny-beaches-and-sacred-temples-in-odisha/)
22. [The Andhra town is home to the guru of Jayalalitha, Hema Malini and Rekha.](http://www.natgeotraveller.in/culture-getaway-exploring-classical-art-and-dance-in-kuchipudi/)
23. [Compelling history, green spaces, & delicious food welcome you in this Tamil Nadu town.](http://www.natgeotraveller.in/vellore-guidethe-old-world-allure-of-this-tamil-nadu-city/)
24. [This region in Tamil Nadu is packed with history and grandeur.](http://www.natgeotraveller.in/chettinad-guide-magnificent-mansions-peppery-cuisine-and-antique-markets/)
25. [Weekend getaway: There's something in these temples for everyone.](http://www.natgeotraveller.in/kumbakonam-guide-visit-for-its-sacred-trails-and-fine-filter-coffee/)
26. [Discovering rare books, opulent paintings, and dancing-girl dolls in Thanjavur.](http://www.natgeotraveller.in/thanjavur-guide-four-ways-to-explore-the-sacred-land-of-five-rivers/)
27. [A local rose-flavoured drink and the native jasmine will enhance your cultural exploration of Madurai.](http://www.natgeotraveller.in/madurai-guide-four-ways-to-explore-the-temple-town/)
28. [Stunning views, flocks of cuddly sheep, smoked garlic that's what Kodaikanal is about. (magazine archive)](https://issuu.com/natgeotravellerindia/docs/ngt_july_2014_for_web)
29. [Four ways to explore the Kerala beach town.](http://www.natgeotraveller.in/surfing-lessons-and-fiery-fish-curry-in-sandy-kovalam/)
30. [This island getaway borrows heavily from the traditional Kerala homestead.](http://www.natgeotraveller.in/stay-soma-kerala-palace-kochi/)
31. [In Fort Kochi's oldest street, a snug, historical home.](http://www.natgeotraveller.in/stay-waltons-homestay-kochi/)
32. [Travel back in time at the 100-year-old Sinna Dorai Bungalow.](http://www.natgeotraveller.in/forest-magic-in-the-colonial-tea-estates-of-valparai/)
33. [Plus Kotagiri's hiking trails, churches and waterfalls.](http://www.natgeotraveller.in/explore-the-nilgiris-through-ootys-botanical-gardens-and-tea-estates/)
34. [Hoysala grandeur comes alive in the temple carvings of Belur and Halebid.](http://www.natgeotraveller.in/chronicles-in-stone-the-elaborately-carved-hoysala-shrines-of-hassan-in-karnataka/)
35. [Sakleshpur offers a year-round escape for the city-weary.](http://www.natgeotraveller.in/sakleshpur-guide-coffee-trails-and-historic-forts-in-karnataka/)
36. [Back to basics at this homestay in Arasinamakki.](http://www.natgeotraveller.in/stay-stream-of-joy-karnataka/)
37. [Kerala's northernmost district makes for a great weekend getaway.](http://www.natgeotraveller.in/kasargod-guide-lighthouse-forts-and-pristine-beaches/)
38. [The lush village lies in a Unesco World Heritage site.](http://www.natgeotraveller.in/agumbe-adventure-reptiles-and-waterfalls-in-the-rainforests-of-karnataka/)
39. [An active break in Bhatkal.](http://www.natgeotraveller.in/coastal-karnataka-road-trip-forest-trails-temple-ruins-and-luscious-mangalorean-food/)
40. [An idyllic weekend getaway in Karnataka.](http://www.natgeotraveller.in/honnemaradu-guide-coracles-and-campfires-at-a-golden-lake-in-karnataka/)
41. [A slice of life in a Goan village.](http://www.natgeotraveller.in/stay-the-only-olive-goa/)
42. [Old-world charm and pineapple pickle in the sunshine state.](http://www.natgeotraveller.in/stay-cancios-house-goa/)
43. [At Capella, curl up with a book by a palm-fringed courtyard.](http://www.natgeotraveller.in/stay-capella-goa/)
44. [Expect new hues every fortnight.](http://www.natgeotraveller.in/kaas-plateau-guide-sitas-tears-cobra-lillies-and-carnivorous-blooms/)
45. [Maharashtra's only heritage hotel built inside a fort.](http://www.natgeotraveller.in/time-travelling-while-staying-at-fort-jadhavgadh/)
46. [Sa-i-Mika has cozy, no-frills rooms in one of the world's wettest landscape.](http://www.natgeotraveller.in/rustic-retreat-sa-i-mika-in-cherrapunji/)
47. [The eco-resort makes for an artsy weekend getaway from Mumbai.](http://www.natgeotraveller.in/stay-avanti-kalagram-maharashtra/)
48. [Go white water rafting, birding, hiking or just relax.](http://www.natgeotraveller.in/mumbai-getaway-go-rafting-birding-or-just-unwind-at-mulshi-lake/)
49. [Weekend Getaway: Rest and relaxation are unavoidable in this rural retreat.](http://www.natgeotraveller.in/a-forest-in-hiding-near-mumbai/)
50. [Skip Rajkot for Jamnagar's snacks and surmo. (magazine archive)](https://issuu.com/natgeotravellerindia/docs/march_2014)
51. [Baroque palaces meet the bare beauty of the White Rann in Bhuj.](http://www.natgeotraveller.in/across-the-salt-desert-exploring-colourful-bhuj/)
52. [A restored Ahmedabad haveli embraces its neighbourhood.](http://www.natgeotraveller.in/stay-french-haveli-ahmedabad/)
53. [Luxury tents in a rustic setting near Sariska National Park.](http://www.natgeotraveller.in/camping-with-benefits-vanaashrya-rajasthan/)
54. [The "city of dawn" will make your spirits soar.](http://www.natgeotraveller.in/udaipur-guide-where-to-eat-shop-and-sightsee-in-the-city-of-dawn/)
55. [Love for the desert and comfort coalesce.](http://www.natgeotraveller.in/stay-suryagarh-rajasthan/)

The best part is this algorithm works just as well when you’re planning a smaller trip within your state as when you’re planning a larger trip spanning the entire world. All the algorithm needs are the distances travelled between every stop so it can compute the optimal route. How you get between those stops is up to you.

With the help of this beautiful algorithm, I managed to move this list to my bucket list. Plan a trip, apply the algorithm, find an optimal path and most importantly, enjoy your vacation. I should now write less about data and more about my experience while covering these amazing places.*



<center><a href="http://www.natgeotraveller.in/" target="_blank"><img src="http://media.natgeotraveller.in/wp-content/themes/natgeo-theme/images/logo.jpg" title="National Geographic" /></a></center>

`Thanks to National Geographic India for this amazing collection.`
