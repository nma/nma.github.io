---
layout: post
title: "All combinations testcase generation"
description: ""
category: ""
tags: []
---
{% include JB/setup %}

Lets start from basic principles, what is combinations and what is permutations?
From there we can derive what we need in the algorithm to generate our all possibly parameter combinations for our test cases given any set of parameters.
Somtimes it may be overkill to exhaustively test all combinations of parameters, there are ways to reduce the combinations and still get the same amount of coverage. 

In a following post, we will take a look at how we can tuncate a set of all combinations to give us all pairs algorithm, which reduces the test space, 
applying the theory of orthogonal arrays to reduce the test combinations. 

Based on sources from http://www.mathsisfun.com/combinatorics/combinations-permutations.html.
Permutations:
    A set of values where ordering matters 
    e.g. a password, the ordering of the characters matter!
    abc is not the same as bca
Combination:
    A set of values where order does not matter
    e.g. a ingredient list, the ordering does not matter!
    bannana, bread, salad is the same as  salad, bread, bannana

So if you want to smartly generate blackbox testing based on the input parameters (aka, ingredients) you want all combinations testcase generation.
Say you have a method that takes in 2 parameters a and b. 
<pre>
| a | b | 
|---|---|
| 3 | 2 |
| 5 | 4 | 
</pre>

Now how do we generate all combinations of testcases based on k parameters?
From the above example, we start with 2 parameters, a and b: 
<pre>
k = 2
a = (1, 2)
b = (3, 4) 
</pre>

We want to output a list of parameter combinations like so:
Output sample: 
<pre>
{a:1, b:3}, 
{a:1, b:4}, 
{a:2, b:3}, 
{a:2, b:4}
</pre>

So for every possible value of paramter a, it has to pair once with a possible input of b.
This results in our O(n^2) solution below:

{% highlight python linenos=table %}
k = 2
a = (1, 2)
b = (3, 4) 

output = []
for a_value in a:
   for b_value in b:
        parameters = {'a':a_value, 'b':b_value}
        output.append(parameters)

print(output)
{% endhighlight %}

But this solution only works with 2 inputs, how do we built it so it can easily accept more than k=2?
So if we add c = (5,6,7), this implementations won''t scale. 
In that case, instead of adding another for loop, we can store the previously completed partialCombinations.
Then values for the parameter of c, we will append the previous partialCombinations to the set.

{% highlight python linenos=table %}
results = []
def build_combinations(inputs, partial_combinations):
    partial_results = []
    
    # grab the first parameter from the inputs
    paramter = inputs.iteritems().next()
    param_name = paramter[0]
    param_values = paramter[1]
    
    for value in param_values:
        # define a new param_combination
        param_combination = {param_name: value}
        # combine all previous partial_combinations into our param_combination
        param_combination.update(partial_combinations)
        partial_results.append(param_combination)

    if len(inputs) <= 1:
        # dump out completed combinations into our result set
        results.extend(partial_results)
    else:
        # keep splitting up the problem until we use up all our inputs
        for partial_combination in partial_results:
            # delete the key of the used input paramter
            inputs_sub_param = dict(inputs)
            del inputs_sub_param[param_name]

            # continue splitting up the problem
            build_combinations(inputs_sub_param, partial_combination)

parameters = {
'a': (1,2),
'b': (3,4),
'c': (5,6,7)
}
build_combinations(parameters, {})

for result in results:
    print result
{% endhighlight %}

Output:
<pre>
{'a': 1, 'c': 5, 'b': 3}
{'a': 1, 'c': 5, 'b': 4}
{'a': 1, 'c': 6, 'b': 3}
{'a': 1, 'c': 6, 'b': 4}
{'a': 1, 'c': 7, 'b': 3}
{'a': 1, 'c': 7, 'b': 4}
{'a': 2, 'c': 5, 'b': 3}
{'a': 2, 'c': 5, 'b': 4}
{'a': 2, 'c': 6, 'b': 3}
{'a': 2, 'c': 6, 'b': 4}
{'a': 2, 'c': 7, 'b': 3}
{'a': 2, 'c': 7, 'b': 4}
</pre>
