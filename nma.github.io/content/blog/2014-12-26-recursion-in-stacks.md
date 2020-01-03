---
title: 'Thinking about Recursion in Stacks'
description: 'Small epiphany on other ways to reason about recursion'
category: 'Interviews'
tags: ['Interviews']
---

Recursion is one of the most common topics in interviews. Recursive solutions usually consist of less code than an interative solution (but not always).
One epiphany I had recently while reviewing common recursive problems is that recursion can be thought of in terms of stacks.

Lets say that you were asked to perform a postorder traversal on a binary tree. How would you write the code for this? The most common answer will involve recursion:
Start traversing the tree from the top, first print the value of the current node, then traverse the left most node, then the right most node; if this node is a leaf, then exit the function.

![BinaryTree](https://s3-us-west-2.amazonaws.com/nickma.com/BinaryTree.png)

{% highlight python linenos=table %}
def postorder(root):
print root.value
  
 if root.left is not None:
postorder(root.left)
  
 if root.right is not None:
postorder(root.right)

    return

{% endhighlight %}

Now if we need to solve the same question, but without using recursion, how would you do it? (this question was actually asking how well can you visualize recursion).
In a nutshell, when the program starts executing, a certain contiguous section of memory is set aside for the program called the stack. [Source](http://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Mips/stack.html)
To better visualize what recursion is, we need to take a look at the program stack for the above method.

![ProgramStack](https://s3-us-west-2.amazonaws.com/nickma.com/ExecutionStack.png)

Everytime a new function is called, it gets added onto this stack, once this method hits a return statement, it gets popped off the stack, and we start executing the last method on the stack.
A recursive function may be called many times (depending on the height of the tree and etc), this is why you see stack overflow errors since the recursive call doesn't terminate and use up all the stack memory!

If you take a look at the program call stack, the recursive execution is basically using the execution stack to implicitly keep track of the traversal order.
We can now write a method to iteratively keep track of the traversal order with an explicit stack.

{% highlight python linenos=table %}
def postorder(root): # using a list as a stack
stack = []
  
 if root is not None:
stack.append(root)

    while len(stack) != 0:
        node = stack.pop()
        print node.value

        if node.right != None:
            stack.append(node.right)

        if node.left != None:
            stack.append(node.left)

    return

{% endhighlight %}

We create a stack using a python list, and add our root node as the first Node. Then we push onto the stack starting with the right node first. Since our stack is LIFO, we have to make sure our left node is the first on that gets popped off.

{% highlight python %}
class Node:
def **init**(self, value, left=None, right=None):
self.value = value
self.right = right
self.left = left

root = Node(50)
root.right = Node(51)
root.left = Node(18, Node(9), Node(24))
{% endhighlight %}

Here is the quick working code [visualization](<http://www.pythontutor.com/visualize.html#code=class+Node%3A%0A++++def+__init__(self,+value,+left%3DNone,+right%3DNone)%3A%0A++++++++self.value+%3D+value%0A++++++++self.right+%3D+right%0A++++++++self.left+%3D+left%0A%0Aroot+%3D+Node(50)%0Aroot.right+%3D+Node(51)%0Aroot.left+%3D+Node(18,+Node(9),+Node(24))%0A%0Adef+postorder(root)%3A%0A++++%23+using+a+list+as+a+stack%0A++++stack+%3D+%5B%5D%0A++++%0A++++if+root+is+not+None%3A%0A++++++++stack.append(root)%0A%0A++++while+len(stack)+!%3D+0%3A%0A++++++++node+%3D+stack.pop()%0A++++++++print+node.value%0A++++++++%0A++++++++if+node.right+!%3D+None%3A%0A++++++++++++stack.append(node.right)%0A++++++++%0A++++++++if+node.left+!%3D+None%3A%0A++++++++++++stack.append(node.left)%0A%0A%0A++++return%0A%0Apostorder(root)&mode=display&origin=opt-frontend.js&cumulative=false&heapPrimitives=false&drawParentPointers=false&textReferences=false&showOnlyOutputs=false&py=2&rawInputLstJSON=%5B%5D&curInstr=31>)
for this problem, start at around step 32 to avoid the tree declaration.
