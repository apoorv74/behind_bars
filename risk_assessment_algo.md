MAD - Risk Assessment Algorithm
================

### Objective

To come up with a data driven measure of an entity's sourcing performance and highlight entites (city/shelter) which have a high risk profile and needs immediate attention.

------------------------------------------------------------------------

### Inputs - Defining a RISK score

<!-- ![input graph](pictures/inputs_to_algo.png) -->
A risk score for sourcing is a combination of 4 factors:

-   **Requirements** - Number of application required to fill a particular role at a city/shelter
-   **Quality** - Rating of the application on a scale of 1 to 5 (higher the better)
-   **Fit** - Applications fit for a certain role
-   **Pace** - Rate of application sourcing

------------------------------------------------------------------------

### Outputs

An index(rank) for citites/sheltes as per the risk score

------------------------------------------------------------------------

### Algorithm

The risk score is calulated at three levels - Cities, Shelters and Roles. The workflow for calculating a city risk score is defined below:

-   Input the requirements matrix for every city. **See the example below for reference**
-   Calculate a requirement metric (proportion of applications remaining), higher the value, higher the risk
-   Calculating a quality rating for every city - Since, quality is dived across 5 levels, this score is an aggregation of values at all levels. The metric is also weighted by stages, *number of applicants at Level 5 will contribute more to the score than Level 4* and so on.

Lets understand this with an example (high score signifies a higher risk):

Case 1 - Total applications received - **100**

Note: **30% applications are in stage 5**

**Level wise participation** -&gt; 30 --- 10 --- 20 --- 10 --- 30

    ## Overall quality score assigned - 3.333

Case 2 - Total applications received - **100**

Note: **10% applications are in stage 5**

**Level wise participation** -&gt; 30 --- 40 --- 10 --- 10 --- 10

    ## Overall quality score assigned - 4.348

**The weight ensures that we focus on cases where quality is suffering and might need extra attention**

-   Calculate the role fit metric - Since this is an attribute of the role, we wont consider it at an overall city level. Note: *For role specific risk calculation, this metric will be calculated as the proportion of fit applications to total applications. Assuming that fit is a 0/1 score given to every application*
-   Calculate the pace metric - Proportion of applications left to source for the season to the days left - Lower the number, the better it is (less risk).
-   Calculate the combined score for every entity - requirement\_metric + quality\_metric + fit\_metric(for roles) + pace\_metric
-   Assign weigts to every metric - Certain parameters are more important than others, and this should be a dynamic calculation as per the requirements of MAD. For the purpose of simulation, lets assumme our priority order is - **Requirements(0.4) &gt; Pace(0.3) &gt; Quality(0.2) &gt; Fit(0.1)**
-   Recalculate risk as per the weights assigned in the previous step
-   Rank the entites as per the risk metric

------------------------------------------------------------------------

### Simulating the algorithm for an Ed Support role for Class 8th across cities

**Requirements matrix**

| City       |  Existing Volunteers|  Volunteer Requirement|  Applications Requirement|  Applications Recevied|  Remaining Applications|  requirement\_metric|
|:-----------|--------------------:|----------------------:|-------------------------:|----------------------:|-----------------------:|--------------------:|
| Mumbai     |                  100|                    200|                       500|                    100|                     400|            0.2000000|
| Chennai    |                   76|                    150|                       250|                     50|                     200|            0.2000000|
| Chandigarh |                   90|                    200|                       450|                    100|                     350|            0.2222222|
| Bengaluru  |                   80|                    150|                       350|                    150|                     200|            0.4285714|
| Delhi      |                   69|                    140|                       300|                    200|                     100|            0.6666667|

**Quality matrix**

| City       |  Total Applications|  Level 1|  Level 2|  Level 3|  Level 4|  Level 5|  quality\_score|
|:-----------|-------------------:|--------:|--------:|--------:|--------:|--------:|---------------:|
| Mumbai     |                 100|       30|       10|       20|       10|       30|        3.333333|
| Chennai    |                  50|       10|        5|       10|        5|       20|        2.941177|
| Chandigarh |                 100|       40|       20|       10|        5|       25|        3.921569|
| Bengaluru  |                 150|       50|       45|       33|       15|        7|        4.491018|
| Delhi      |                 200|       70|       55|       30|       40|        5|        4.395604|

**Role Fit matrix**

| City       |  Percent Fit|  fit\_metric|
|:-----------|------------:|------------:|
| Mumbai     |           60|     1.666667|
| Chennai    |           70|     1.428571|
| Chandigarh |           40|     2.500000|
| Bengaluru  |           50|     2.000000|
| Delhi      |           67|     1.492537|

**Pace matrix**

| City       |  Volunteers applied this season|  Duration(days)|  Difference from target|  Days left in the season|  pace\_metric|
|:-----------|-------------------------------:|---------------:|-----------------------:|------------------------:|-------------:|
| Mumbai     |                             100|              40|                     400|                       50|      8.000000|
| Chennai    |                              50|              26|                     200|                       64|      3.125000|
| Chandigarh |                             100|              35|                     350|                       55|      6.363636|
| Bengaluru  |                             150|              43|                     200|                       47|      4.255319|
| Delhi      |                             200|              37|                     100|                       53|      1.886793|

**Priority Weights**

**Requirements &gt; Pace &gt; Quality &gt; Fit**

(0.4) &gt; (0.3) &gt; (0.2) &gt; (0.1)

**Combined score**

|     | City       |  requirement\_metric|  pace\_metric|  quality\_score|  fit\_metric|  total\_score|  rank|
|-----|:-----------|--------------------:|-------------:|---------------:|------------:|-------------:|-----:|
| 1   | Mumbai     |            0.0800000|     2.4000000|       0.6666667|    0.1666667|      3.313333|     1|
| 3   | Chandigarh |            0.0888889|     1.9090909|       0.7843137|    0.2500000|      3.032294|     2|
| 4   | Bengaluru  |            0.1714286|     1.2765957|       0.8982036|    0.2000000|      2.546228|     3|
| 5   | Delhi      |            0.2666667|     0.5660377|       0.8791209|    0.1492537|      1.861079|     4|
| 2   | Chennai    |            0.0800000|     0.9375000|       0.5882353|    0.1428571|      1.748592|     5|

**RISK Profile** - Cities ranked according to there risk score

    ## Order of risks - Mumbai > Chandigarh > Bengaluru > Delhi > Chennai

------------------------------------------------------------------------
