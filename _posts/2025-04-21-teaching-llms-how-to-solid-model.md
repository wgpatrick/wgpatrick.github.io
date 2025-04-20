---
layout: post
title: "Teaching LLMs how to solid model"
date: 2025-04-21 10:00:00 -0800
category: Technology
--- 

It turns out that LLMs can make CAD models for simple 3D mechanical parts. And, I think they'll be extremely good at it soon. Let me tell you how.

## An AI Mechanical Engineer

Code generation is the first breakthrough application for LLMs. What would an AI agent look like for mechanical engineering? Material selection, design for manufacturing, computer-aided manufacturing (CAM), and off-the-shelf part comparison would all be important elements for an AI mechanical engineer. Perhaps, most importantly, an AI mechanical engineer would possess the ability to design and iteratively improve CAD models. Mechanical engineers typically design CAD models using point-and-click modeling software (e.g. Fusion 360, Solidworks, and Onshape). How could AI generate these solid models instead? 

## Code generation meets CAD

One promising direction is training a generative model on millions of existing solid models. This approach is being actively explored by [multiple](https://damassets.autodesk.net/content/dam/autodesk/www/pdfs/brepgen.pdf) [researchers](https://arxiv.org/pdf/2105.09492) who are exploring both diffusion and transformer architectures. In particular, I really like [Autodesk Research](https://www.youtube.com/watch?v=5r1qQ5DOsUI)'s approach to encode the parametric steps that comprise a design file (points, curves, shapes, extrusions, etc) into a transformer architecture, so the output of the generative process is a design file with an editable parametric history. As far as I understand, the models produced in these research projects cannot yet take an arbitrary input command via text or voice and generate a desired shape.

Then a few weeks ago, I was inspired by the [recent use of LLMs to drive Blender](https://github.com/ahujasid/blender-mcp), the open source modeling tool widely used for animation. Given that LLMs are incredibly good at generating code, perhaps programmatic interfaces for CAD modeling could be used to generate solid models in a similar way. I immediately thought of [OpenSCAD](https://openscad.org/), an open-source programmatic CAD tool that's been around for more than 15 years. Instead of using point-and-click software to create a solid model, the user writes a software script, which is then rendered into the solid CAD model.

## LLMs rock at writing OpenSCAD

To test it out, I created a simple project in Cursor, made a blank OpenSCAD script (Cursor.scad), and added some Cursor rules: 

```
# Your rule content

- We're creating files to model things in open scad. 
- All the OpenScad files you create will be in Cursor.scad. I've set up this file such that if you edit it, it will automatically be read by OpenScad (it's the open file in the program). 
- If I want to save what you've done, I'll tell you and you should create a new file and put it in the Saved folder. 
- That's it! Overtime, if needed, we could create documentation about how to use OpenScad. 
- If I'm asking you to create a new design, you should delete the current contents of cursor.scad and add the new design into it.
- When I make requests you should always first develop a step by step plan. Then tell me the step by step plan. And then I'll tell you to start modeling. 
- When you're going through the step by step plans, only execute one step at a time. 
- When you've executed a step, ask the user if its right.
```

Then, I started solid modeling!

Here's an example:  "Create an iPhone case". 

![iPhone GIF](/assets/images/blog/iphone.gif)

It didn't nail it on the first try, but with a couple of iterations (including giving it screenshots) a basic case was created. 

You can also leverage OpenSCAD libraries (there are many public libraries). Here, I use a library (that Cursor identified) to make a thread for a flange.

![Flange GIF](/assets/images/blog/flange.gif)

One thing that's pretty neat is that it can use its general knowledge of mechanical engineering and mechanical parts to help with the modeling. For example, above, Cursor created holes in the pipe for M6 bolts and it correctly made the diameter slightly bigger than 6 mm, so the bolts could pass through.

```openscad
bolt_hole_d = 6.5; // Diameter for M6 bolts
```

Of course, one of the really nice things about this approach is that the files are editable and Cursor defaults to parameterizing all the key elements of the design. In the above example, I asked it to add holes for mounting bolts, which it did, and then I edited the number of holes manually to 3 from 4. 

```openscad
// Flange parameter
flange_OD = 50; // Outer diameter of the flange in mm 
flange_thickness = 10; // Thickness of the flange in mm
pipe_size = 1/2; // NPT Pipe Size

// Bolt hole parameters
num_bolts = 3;
bolt_hold_d = 6.5; // Diameter for M6 bolts
bold_hole_circle = 35; // Diameter for the bolt circle
```

## Building an eval for LLM -> OpenSCAD -> STL

I was impressed by these initial results and it made me want to better understand just how good these LLMs have gotten at creating solid models. For example, does reasoning help these models think through the steps of creating a part? So, I decided to develop an evaluation to test the performance of various LLMs at generating solid models via OpenSCAD.  

One of the challenges with creating an eval for CAD design is that most tasks likely have many correct answers. For example, a task such as "make a m3 screw that's 10mm long" could have many correct answers because the length, diameter, and style of the head are not defined in the task. To account for this, I decided to write the tasks in my eval with enough information such that there's only a single, correct interpretation of the geometry. 

For example, here's one of the tasks in the eval:

>This is a 3mm thickness rectangular plate with two holes. 
>
>1. The plate is 18mm x 32mm in dimension. 
>
>2. When looking down at the plate, it has two holes that are drilled through it. In the bottom left of the plate, there's a hole with a centerpoint that is 3mm from the short (18mm) side and 3 mm from the long (32mm) side. This hole has a diameter of 2mm. 
>
>3. In roughly the top left corner of plate, there's a hole of diameter 3mm. Its center point is 8mm from the short side (18mm side) and 6mm away from the long (32mm) side.

The benefit of this approach is that we can score each task as a Pass or Fail and we can do this in an automated way. I wrote 25 total CAD tasks which ranged in difficulty from a single operation ("A 50mm long pipe that has a 10mm outer diameter and 2mm wall thickness") to 5 sequential operations. For each task, I designed a reference CAD model using Autodesk Fusion 360 and then exported a STL mesh file. 

Then, I set about programming the automated eval pipeline (of course, I didn't actually write much code, [Cursor did](https://willpatrick.xyz/software/2025/03/17/software-with-a-market-of-one.html)). 

Here is how the eval pipeline works:

1. For each task and model, the eval sends the text prompt (along with a system prompt) to the LLM via API. 
2. The LLMs send back the openSCAD code. 
3. The openSCAD code is rendered into a STL
4. The generated STL is automatically checked against the reference STL 
5. The task "passes" if it passes a number of geometric checks. 
6. The results are then outputted in a dashboard.

[Note: The eval runs multiple replicates per task x model combo. And the eval is executed in parallel, because there there are 1000+ tasks when running the full evaluation]

Here's how the geometric check works: 

* The generated STL and reference STL are aligned using the iterative closest point (ICP) algorithm. 
* The aligned meshes are then compared by: 
    * Their volumes (pass = <2% diff)
    * Their bounding boxes (pass = <1 mm)
    * The average chamfer distance between the parts (pass = <1 mm)
    * The Hausdorff distance (95% percentile) (pass = <1 mm) 
* To "pass" the eval, all of the geometric checks must be passed.

There are a few areas where the eval pipeline could be improved. In particular, false negatives are somewhat common (est: ~5%). I've also noticed that occasionally, small features that are incorrect (like an incorrect fillet) are not caught by the automated geometry check. Nevertheless, the eval pipeline is still good enough to see interesting results and compare the performance of various LLMs. 

If you'd like to learn more about the eval, use it, or check out the tasks, please check out the [GitHub repo](https://github.com/wgpatrick/cadeval).

Finally, there are a number of ways to improve the evaluation. Here are a few things that I'd like to do next:

* More tasks with greater coverage
* Optimize system prompts, in particular by adding OpenSCAD documentation and code snippets 
* Create an eval variation that uses sketches and drawings as input
* Add another variation that tests the ability of the LLM to add operations to existing OpenSCAD script and STL
* Evaluate the ability of the LLM to fix mistakes in an existing STL / OpenSCAD code

## Rapid improvement of frontier models

It turns out that the LLMs only became good at this very recently. While working on this project, 3 of the top 5 performing models were released.

<figure>
  <img src="/assets/images/blog/overall_result.png" alt="Results from CadEval">
  <figcaption>In this run, each model attempted to complete 25 tasks (4 replicates per task). "Success" means they passed a number of geometric checks that compared to a reference geometry.</figcaption>
</figure>

As you can see, Gemini 2.5 and OpenAI's reasoning models are currently the best performing with Anthropic's models slightly behind. These models offer huge performance increases compared to their predecessor, non-reasoning counterparts. Interestingly, sonnet 3.5 is the best non-reasoning model, but thinking does not boost sonnet 3.7's performance. 

Gemini 2.5 Pro is the cheapest of the 3 top performing model, while o3 was slightly faster. 

![Time per task](/assets/images/blog/total_time.png)

![Cost per task](/assets/images/blog/cost_per_task.png)

All of the results as well as the configuration details from the run are available [here](https://willpatrick.xyz/cadevalresults_20250418/).

Here are a couple of examples of parts from the eval. This is one of the most complicated parts. O1-2024-12-17 successfully modeled in a single shot. Plotted are two aligned point clouds for the reference (green) and generated (red), which as you can see, look identical.

![Correct Part](/assets/images/blog/correct_part.png)

Here's an example of a failed part from Gemini 2.5 Pro. It messed up the placement of the counterbore, putting it on the opposite side of the part compared to what the task called for. 

[Incorrect Part](/assets/images/blog/incorrect_part.png)

## Start-ups 

In the past few months, two different start-ups launched text-to-CAD products, AdamCad and Zoo.dev. Zoo.dev offers an API to use their text-to-cad model. I added Zoo into the eval pipeline to compare against the LLM -> OpenSCAD pipeline. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We&#39;re excited to announce the launch of Zoo.dev, a text-to-CAD API that lets you generate 3D models from text descriptions.<br><br>We&#39;ve been working on this for the past year, and we&#39;re finally ready to share it with the world.<br><br>Here&#39;s a thread on what we&#39;ve built 🧵 <a href="https://t.co/Yd9Yd9Ixqm">pic.twitter.com/Yd9Yd9Ixqm</a></p>&mdash; Abhishek (@abhi1thakur) <a href="https://twitter.com/abhi1thakur/status/1881766438383337573?ref_src=twsrc%5Etfw">July 21, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


Instead of generating OpenSCAD, the Zoo.dev API shoots back a STL directly. Zoo says they use [proprietary dataset and machine learning models](https://zoo.dev/machine-learning-api). To my surprise, Zoo's API didn't perform particularly well in comparison to LLMs generating STLs by creating OpenSCAD. Despite that, I'm excited to see the development of Zoo.dev and I will be eager to see how future model launches from Zoo.dev compare to LLM->OpenSCAD. 

## What's next? 

I think these initial results are promising. Cursor (or another code generation tool) + OpenSCAD offers a solution for producing solid models in an automated way. 

However, I don't think this approach is about to take off and spread rapidly through the CAD design ecosystem. The current set-up is seriously clunky and I think specific product improvements are needed to make this work better: 

* Tools that bring in console logs and viewport images to Cursor from OpenSCAD for iterative improvement and debugging.
* A UI to highlight (and measure) certain faces, lines, or aspects of a part, which are fed to the LLM for additional context.
* Drawing or sketch-input, so the user can import drawings or a create a quick sketch.
* A UI that allows the user to use sliders to adjust parameters instead of editing the code. 

Additionally, I expect that further model advances will continue to unlock this application. In particular, improving spatial reasoning is an [active area of research](https://arxiv.org/pdf/2504.05786). I imagine that improved spatial reasoning could greatly improve models' ability to design parts step by step.

So when does text-to-CAD become a commonly used tool for mechanical engineers? With start-ups actively building products and the rapid improvement of frontier models, my guess would be something like 6-24 months.

## Where does this go?

In the medium to long term (2-10 years), I imagine that most parts will be created with a form of GenCAD. Allow me to speculate.

* Initially, GenCAD will be used to create parts that fit within existing assemblies. For example, you might say: "I need a bracket that fits here."  And, the GenCAD tool will create a bracket that perfectly joins with the existing assembly components. Want to analyze three variants with FEA? Ask for them. I expect mainstream CAD suites (Autodesk, Solidworks, Onshape) to add these capabilities directly into their product suite.
* Longer term, I imagine GenCAD will reach every aspect of a CAD suite: sketches, mates, assemblies, exploded views, CAM tool-pathing, rendering visualizations, and CAE. Imagine a design review where you highlight a subassembly and say "replace these rivets with M6 countersunk screws and regenerate the BOM." The model, drawings, and purchasing spreadsheet all update in seconds. 

We're watching CAD begin to exit the manual-input era. I, for one, am quite excited about that.
