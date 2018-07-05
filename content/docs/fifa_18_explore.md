---
date: 2018-06-29T14:00:00+06:00
title: FIFA WC 2018 - with mlr, jq and friends!! 
authors: ["muniftanjim"]
categories:
  - football
tags: 
  - command-line
  - analysis
slug: fifa-2018
cover:
  image: /images/banner_fifa18.jpg
  caption: Kroos, from zero to hero [FIFA](https://fifa.com/worldcup/news/kroos-from-zero-to-hero-2966896)
  style: full
---


The group stage of **FIFA World Cup 2018** ended yesterday with Belgium defeating England by a goal. What a tournament this is turning out to be, superb goals (Kroo's banger was the best for me), not-so-predictable results, the Asians playing well (good luck Japan), extra time surprises and who can forget those VAR stories of penalties. Here is Nordin Amrabat showing some love for the technology. 


{{<youtube HpQJ8rxaPi0>}}

This has also been a tournament with some of the best tweets I've read. Just have a look at this probability plot for possible Group F outcomes.

{{<tweet 1011967148149727234>}}

Follow [@JPVSilva88](https://twitter.com/JPVSilva88), [@jburnmurdoch](https://twitter.com/jburnmurdoch), [@StatsZone](https://twitter.com/StatsZone) for such amazing updates and [@8bitfootball](https://twitter.com/8bitfootball) for some 8 bit swag !!


I went on the exploration mode as well since the tournament started as the game is full of data points and you just need some curious minds to weave them together and come up with beautiful stories. Sometime back, I was introduced to a functional command line utility called [miller](https://johnkerl.org/miller/) by John Kerl. In short *miller* is like awk, sed, cut, join, and sort for name-indexed data such as CSV, TSV, and tabular JSON. I wanted to share and promote it as it has been a productive tool for me and what better opportunity than using it to explore the World Cup. You should definitely consider adding it to your data processing toolkit. 

For this post, we'll use such open source command line utilities like *miller*, *jq* (the json processor), some *awk*, *sed* (where I'm not yet skilled enough to use miller) and **R** (of-course) to analyse the tournament so far and let's see if we can come up with something worth a share. For the data, we'll be using the superb API from [football-data.org](http://football-data.org/). I'll urge you to get your *API* key before proceeding further which can be obtained easily from this [link](https://www.football-data.org/client/register). We'll be registering for the free account as the data we get access to is somewhat sufficent for this post but you should definitely check out the full version as well. The team is doing an amazing job to get us the live updates as fast as possible. So let's get started!!

The fixtures for the knock-outs have been finalised. So let us start by checking who's playing whom

```bash

#KO fixtures

curl "http://api.football-data.org/v1/competitions/467/fixtures?timeFrameStart=2018-06-30&timeFrameEnd=2018-07-03" \
 | jq '.fixtures[] | {htn:.homeTeamName, atn:.awayTeamName, date:.date, matchLink:._links.self[]}' \
 | mlr --ijson --opprint --barred cat
```

<img src="/images/ko_fixtures.png" title="KO fixtures" />

> Some mouth watering clashes there, high hopes for France vs Argentina, let's have a look at there past world cup fixtures. 

```bash

# Past clashes

curl "http://api.football-data.org/v1/fixtures/165119" | \
 jq '.head2head.fixtures[] | {htn: .homeTeamName, atn: .awayTeamName, result:.result, date:.date}' | \
 mlr --ijson  --ocsv rename result:goalsHomeTeam,goalshometeam,result:goalsAwayTeam,goalsawayteam | \
 mlr --icsv --ocsv put '$goalshometeam>$goalsawayteam {$result=$htn}; $goalshometeam<$goalsawayteam {$result=$atn}; $goalshometeam==$goalsawayteam {$result=drawn}' | \
 mlr --icsv --opprint --barred cat
```

<img src="/images/past_clashes.png" title="Past clashes" />

> Two matches and Argentina winning both of them, though I feel France will be on the winnig side this time around. 

Some football trivia courtesy *OneFootball* - On both these occasions, Argentina reached the final,loosing it in 1930 and winning it in 1978. The last South American team to beat France were Argentina in 1978, since then, France are unbeaten in 8 world cup fixtures against CONMEBOL opposition (W4, D4)

France as a team is studded with stars at all positions. But how has there journey been till now, let's have a look at there Group Stage results. 

```bash

# Group stage performance - France

curl "http://api.football-data.org/v1/competitions/467/fixtures" | \
 jq '.fixtures[] | {homeTeamName: .homeTeamName, awayTeamName: .awayTeamName, resultHomeTeam: .result.goalsHomeTeam, resultAwayTeam:.result.goalsAwayTeam}' | \
 mlr --ijson --ocsv filter '($homeTeamName == "France" || $awayTeamName == "France") && ($resultHomeTeam != "")' |
 mlr --icsv --opprint --barred cat
```
<img src="/images/france_gs.png" title="France - Group stage performance" />

> France won both there matches against a weaker opposition, but drew with Denmark. They'll definitely have to play better than that to beat Argentina. 

Instead of querying the API for every team, let us prepare a temporary dataset with all teams and filter as per our needs

```bash
# Preparing the result dataset for the group stages

curl "http://api.football-data.org/v1/competitions/467/fixtures" | \
 jq '.fixtures[] | {htn: .homeTeamName, atn: .awayTeamName, rht: .result.goalsHomeTeam, rat:.result.goalsAwayTeam}' | \
 mlr --ijson --ocsv cut -f atn,rht,rat | \
 mlr --icsv --ocsv rename atn,team,rht,ga,rat,gs > /tmp/results_all_teams.csv && cat results_wc.csv | \
 mlr --icsv --ocsv cut -f htn,rht,rat | \
 mlr --icsv --ocsv rename htn,team,rht,gs,rat,ga > /tmp/home_scores.csv && awk 'BEGIN {FS="," ; OFS = ","}; {print $1,$3,$2}' /tmp/home_scores.csv > /tmp/home_scores_mod.csv && sed 1d /tmp/home_scores_mod.csv >> /tmp/results_all_teams.csv
```

Now let's have a look at the *top goal scoring* teams in the group stage. 

```bash

#Goal For and Goals against

cat /tmp/results_all_teams.csv | \
 mlr --icsv --ocsv filter '$team != "" && $gs >= 0' | \
 mlr --icsv --opprint --barred  stats1 -a sum -f gs,ga -g team then sort -nr gs_sum
```
<img src="/images/top_goal_scorers.png" title="Top Goal Scorers" />

> Wooh !! Belgium tops the charts with 9 goals, closely followed by England and Russia with 8 goals each. 

> France and Argentina scored 3 goals each, though Argentina conceeded 5 while France only let 1 goal in. This can be a deciding factor between the two teams. 

Now, let's move on to my favorite part of this analysis, the **Players** themselves. For this, we will write a small R script to fetch data for all players participating in this competition. 

```R
library(tidyverse)
library(httr)

team_page <- "http://api.football-data.org/v1/competitions/467/teams"

all_teams <- team_page %>% httr::GET() %>% httr::content()

player_links <- lapply(lapply(lapply(all_teams$teams,'[[','_links'),'[[','players'),'[[','href')

all_player_info <- lapply(player_links, GET)

all_player_info <- lapply(all_player_info,content)

write(jsonlite::toJSON(all_player_info,auto_unbox = TRUE),"/tmp/all_players.json")
```

We will need a players name, position and date of birth. Let's fetch these details from the json

```bash
cat /tmp/all_players.json | \
 jq '.[].players[] | {name:.name,position:.position,dateOfBirth:.dateOfBirth}' | \
 mlr --ijson --ocsv cat > /tmp/all_players.csv
```

*Kylian Mbappé* was declared the youngest goal scorer for France at World Cup Finals. He's definitely not alone as there are a lot of youngsters participating in world cup. Let's look at the top 10 youngest players. 

Note: *Some players were a part of there larger WC squads but not of the last 23, so there can be some discrepancies in the API.*

```bash
cat /tmp/all_players.csv | \
 mlr --icsv --ocsv put '$age=(systime()-strptime($dateOfBirth,"%Y-%m-%d"))/(365*24*3600)' | \
 mlr --icsv --ocsv sort -nf age | \
 mlr --icsv --opprint --barred head -n 10
```

<img src="/images/young_players.png" title="Top 10 young players as per age" />

Since, the API provides the position labels as well, lets look at some position level statistics

```bash
cat /tmp/all_players.csv | \
 mlr --icsv --ocsv put '$age=(systime()-strptime($dateOfBirth,"%Y-%m-%d"))/(365*24*3600)' | \
 mlr --icsv --ocsv --barred sort -nr age | \
 mlr --icsv --opprint --barred stats1 -a min,max,mean -f age -g position
```

<img src="/images/position_stats.png" title="Position Stats" />

> Looks like teams trust experience goalies at the tournament, average age of a keeper is ~30 years. Left wing is an attacking position (Sadio Mane for Liverpool), most players here are ~25 years of age 

How can we not use a *ggplot* with such a beautiful dataset. What if we can plot the youngest and the oldest players at every potion and look at the results on top of a rectangular field (the same way team roasters are presented live on televisions). 

We wrote a [small script](https://gist.github.com/apoorv74/e4108b9ad9d3d14eb208dd15505be3b6) for this task, it takes two parameters, player data (name, age, position, country) and the type ([y]oung/[o]ld) and then plots a field with names and respective country flags. Lets look at the results.


#### <center> Team Agile 11
```bash
./getPositionStats.R /tmp/all_players_age.csv y
```

<img src="/images/teamYoung.png" title="teamYoung" />

Yes, i know, Kylian Mbappé is not part of the youngest team, API tags him as a right winger and there are players younger than him at that position. Not my fault fellas!!


#### <center> Team Wisdom 11 
```bash
./getPositionStats.R /tmp/all_players_age.csv y
```

<img src="/images/teamSenior.png" title="teamSenior" />

And here's our tribute to the oldest player participating in this WC!!

{{<tweet 1011258958076510208>}}

We are almost towards the end, let's end our exploration by checking if I share my birthday with some WC players participating in 2018.

```bash
cat /tmp/all_players.csv | \
 mlr --icsv --ocsv put '$age=(systime()-strptime($dateOfBirth,"%Y-%m-%d"))/(365*24*3600)' | \
 mlr --icsv --opprint --barred filter '$dateOfBirth == "1991-04-07"'
```
And yes!! The Serbian and Crystal Palace Midfielder .. 

<img src="/images/share_bday.png" title="We were born on the same day !!" />

Thanks for reading :)

I learnt a lot of things writing this and I hope you will too. 

I could have not written this with the help of such brilliant open source tools. I thank and appreciate there creators and the community behind it and hope we can support it in whatever ways we can. The documentation of these tools is brilliant and can be accessed [here](https://johnkerl.org/miller/doc/reference.html) and [here](https://stedolan.github.io/jq/manual/). 

Enjoy the World Cup guys, Bring on the Knock Outs!!

{{<youtube jXLFIpBta2E>}}