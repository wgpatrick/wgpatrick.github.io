# Presentation Outline

1. Intro slide: 
    - Moonshot Proposal, Date, Will Patrick

## **Part A: About Will**

1. Career Highlights (Visual Slide)
    - A three-panel slide with one image for each key experience.
    - Image 1: `assets/images/projects/wing/wing-01.jpg` (Label: X)
    - Image 2: `assets/images/projects/mushtari/mushtari-01.jpg` (Label: MIT Media Lab)
    - Image 3: `assets/images/projects/cloud-bioreactor/cloud-bioreactor-01.jpg` (Label: Culture Biosciences)
2. Personal Life
    1. Family
    2. Community building
    3. Creative projects
3. Why X? 
    1. People
    2. Project(s)
    3. The Factory
4. Interesting problems:  
    1. Science → More productive
        1. A "CRISPR-sized" discovery per month, or week! 
    2. Life sciences → More productive
        1. Maybe it shouldn't take decade and a $B to bring a drug to market?
    3. Mechanical engineering → Fast as software engineering
        1. What if a new EV prototype could be designed & tested in a month instead of a 1-2 years?
    4. Infrastructure costs → Reverse the trend
        1. Make housing, roads, trains, etc, cheap again.

## Part B: Moonshot proposal

### Lights out factory for biologics

1. Moonshot Proposal: Lights-out factory for biologics manufacturing

1. Problem: It takes ~5 years and ~$500M - $1B to build a new biologics manufacturing facility

1. Solution: Fully automated biologics manufacturing facility
    1. Full automation → 
        1. Cheaper to operate
        2. Higher max utilization 
        3. Flex capacity
    2. Cheaper to build: 
        1. no conventional clean rooms
        2. inexpensive locations
        3. ~75% cheaper per square ft ($1,000 - $1,500 → $250 - $375)
    3. Faster to build 
        1. 

1. Breakthrough tech: An autonomous process technician
    1. Fleet of robots operates all unit operations
    2. Possible due to recent technical advances: 
        1. LLM planning
        2. Sim2Real
    3. Teleoperation for long-tail autonomy problems

1. The Business Opportunity: A dominant CDMO 
    1. Market: 
        1. CDMO market size: $20B and growing
        2. Highly fragmented, low differentiation. 
    2. Higher margin
    3. Low risk: Same biz model, same processing technology
    
2. Rapid Evaluation: "Is there a there, there?"  (0-3 months)
    1. Goal: 
        1. Eval / try to kill
        2. If alive, build project plan to be green lit
    2. Evaluation Elements: 
        1. Modeling
        2. Customer validation
        3. Technology Eval + Forecasting
    3. Phase 1 (6-12 months):  "Tackle the monkey" // Tech de-risking

1. Modeling
    1. Goal: 
        1. Forecast improvements to: 
            1. Operational cost
            2. Capex cost
            3. Facility build-out time
            4. Utilization (+ revenue)
            5. Margin
    2. Model would include:
        1. Capital equipment model 
        2. Build-out timeline
        3. Operational model
    3. Change model: 
        1. (+) Robots → (+) capex, (-) opex, (-) build time
        2. (-) Clean rooms → (-) capex, (-) opex, (-) build time
        3. (?) Modular build-out (?)
    4. Exit criteria: 
        1. Are there substantial improvements to capex, opex, build-out time? 
        2. Any highly sensitive elements?
    
2. Initial tech eval + forecasting
    1. Input: 
        1. Customer process information (PDF documents)
        2. Customer materials (organisms, media)
    2. Output: 
        1. GMP Drug product
        2. Data / quality documentation 
    3. Solution elements: 
        1. Robot platform: 
            1. Navigate in known environment
            2. **Execute n known unit operations**
            3. **Adapt to process changes (planned or real-time)**
        2. Facility design: 
            1. Bioprocess facility design
                1. Sterilization / clean room 
            2. "Automation-friendly" 
        3. Software orchestration: 
            1. Plant software (MES & SCADA esque + 21 CFR Part 11 )
            2. Robot planning 
            3. Robot Tele-operation 
            4. Reasoning and process
        4. Commentary (maybe just voice-over):
            1. "Full-stack" solution: big value accrues from doing *everything* [Helps with competitive pressure]
            2. Robot platform (+ some of the software orchestration) could be an initial product 
            3. Tech risk: there's a goldilocks amt. Don't want it to be too easy!

1. Customer development
    1. ~10 customers interviews 
        1. Get feedback on moonshot
        2. Collect key datapoints to inform model
        3. Gauge customer interest
    2. Exit criteria: 
        1. Clarity on value prop 
            1. Cheaper?
            2. Faster to get started?
            3. Fewer lost commercial batches? 
        2. Handful customers interested in partnering
        3. Clarity on go-to market:
            1. Start with robotics solution + partner with existing CDMO or biopharma co 
            2. Start with CDMO

1. Phase 1: "Tackle the monkey" 
    1. Develop benchmark for robotics tasks
        1. All unit operations for a commercial biologics cGMP process
        2. Define success for each task
    2. Start eng development. Some items (non-exhaustive):
        1. Developed simulated version of all tasks 
        2. Develop robot software 
        3. Evaluate 
        4. Identify / buy robot platform(s)
        5. Identify where real-world datasets needed
        6. Improve 
    3. Identify major gaps: 
        1. Task 
    4. Exit Phase 1: 
        1. All unit operations 

### AI mechanical engineer

1. AI Mechanical Engineer 

1. Problem: End-to-end mechanical design is 10-100X slower than software
    1. Design loops (requirements → CAD → Test/Simulation → Analysis) can take months
    2. Silo'd mechanical engineering knowledge
    
2. Solution: An AI mechanical engineer. Specifically a system that: 
    1. Ingests specifications (natural language, drawings, references)
    2. Runs CAD/CAE/DFM cycles (potentially X1000 in parallel)
    3. Returns production-ready CAD, manufacturing plans, and BOMs 

1. Breakthrough technology(s): 
    1. Advancing core intelligence of frontier models
    2. Improving spatial reasoning
    3. New datasets
    4. RL post-training with verifiable rewards

1. How This Gets Big: 
    1. "Cursor" for mechanical engineers
        1. Market: 
            1. CAD, CAE, PLM market is already $30B+ and 5M mechanical engineers work globally
        2. Differentiation: Speed-up workflows & increase productivity
    2. Model business: 
        1. Help make Gemini win in this emerging market segment
    3. Downstream business opportunities:
        1. "If this happens, what else becomes possible?" 
            1. Mass customization: Use example of GC on home, or contractor building datacenter 
            2. Design democratization
    
2. Rapid Evaluation: Identify Product Strategy
    1. Break down "AI Mechanical Engineer" to sub-task
    2. Quantify value of each sub-task 
    3. Technical forecasting for each sub-task

1. Break down "AI Mechanical Engineer" into sub-tasks 
    1. Each sub-task: 
        - Input -
        - Output -
    2. Start with my intuition
    3. "Shadow" 2-3 internal MechEs at X for a week and refine list. 
    
2. Identify sub-task value
    1. Goal is to figure out if there's an obvious elements of the workflow that are most valuable.

1. Technical forecasting of each sub-task. 
    1. Identify: 
        1. Any existing benchmarks similar to the input / output of the sub-tasks? 
        2. Any existing applications or prior art that are doing the sub-task? 
        3. Any relevant public datasets? 
    2. Build evals, if possible: 
        1.  Goal: quantitatively evaluate current models abilities on sub-tasks 
    3. Identify overall gaps
    
2. "Tackle the Monkey": What would post-evaluation look like? 
    1. Intuition (at the moment): model capability & datasets are most important to making progress 
    2. Gaps: There aren't public benchmarks and relevant public datasets to accelerate research
    3. Opportunity: 
        1. Develop and open-source benchmarks, public datasets, and, in some cases, models to accelerate research community progress
        2. Develop closed-sourced agent workflows / fine-tuned Gemini models

# Prompt from X

As Jill probably mentioned before, we'd like to ask you to come onsite to X, the moonshot factory, to do a short moonshot presentation to the team and then have some Q&A time.

**Presentation breakdown (one hour)**
   * 5 minute intros on our side of anyone new in the room.
   * 5 minute intro on your education/experience.
   * 20 minute Moonshot Proposal, i.e. big problem/opportunity, solution, and breakthrough tech to enable it. 
   * 25 minute discussion of the Moonshot Proposal with the team
   * 5 minute free form questions from both sides.
*A couple things to consider in your presentation: Why do you think X is the right place to do it? Ensure that the risk is in the technology and not the market (technology has to have a 3% chance of working, and the market/need are obvious). Please make your idea a true moonshot – an idea that includes a major technology breakthrough to achieve but that would have incredible impact if accomplished.*

# Option 1: Dark factory for drug manufacturing

| **Problem** | Building and running a GMP drug mfg plant costs ≈ US $1 billion, takes 5–7 years, and is constrained by contamination risk and round-the-clock staffing |
| --- | --- |
| **Solution** | A fully "lights-out" GMP facility in which robots execute all operations, eliminates the need for clean rooms, collapses CAPEX by >10×, improves OPEX (savings of >50%), increases utilization, and greatly improves build-out timeline. |
| **Breakthrough technology** | An autonomous process technician: a fleet of robots that can run all operations, made possible by recent advances in LLMs and sim-to-real training. |
| **Why could this be big?**  |  |
| **Why low market risk?*** | Large pharma already outsources biologics manufacturing to CDMOs. As long as the facility produces at high-quality, there shouldn't be a risk. An example of a new CDMO entrant that has succeeded to gain market share quickly is Samsung. |
| **Why X?** | It resembles "Waymo". The effort primarily involves solving a long-tail of problems that are identified during testing.  Additionally, X has multiple biology-related moonshots in house. |
| **What's the company look like?**  | A CDMO (e.g. Lonza**, Catalent). The CDMO market is ~$20B and is growing. With the huge advances from autonomy, the NewCo could dominate the CDMO market and become a "TSMC-like" business in biologics manufacturing |

*There are market risks: large pharma is risk averse and they'll need proof that production is at high quality.
**Worth noting that the largest CDMO is ~ $45B market cap. So not massive. Its an extremely fragmented market.

# Option 2: AI Mechanical Engineer

| **Problem** | End-to-end mechanical design ( requirements to CAD, bill of materials, and manufacturing plan) — still runs on month-long iteration loops, making hardware innovation 10–100 × slower and costlier than software. |
| --- | --- |
| **Solution** | A "AI Mechanical Engineer" that ingests a specification (natural language, drawings, references), autonomously explores thousands of design/simulation/DFM cycles in parallel, and returns production-ready models, bill of materials (BoMs), and manufacturing plans.  |
| **Breakthrough technology**** | Advancing intelligence from frontier models, improved spatial reasoning, and agents for core mech tasks (CAD, simulation, DFM, off-the-shelf part selection, vender sourcing and collaboration).  |
| **Why X?** | Sits between Google DeepMind's frontier-model research and X's heritage in robotics/hardware development (Wing, Intrinsic, Everyday Robots). Product research can completed internally with the multitude of mechanical engineers on the existing, internal team. |
| **Why low market risk?*** | Universal need: every automotive, aerospace, consumer-electronics, hardware, and robotics firm spends millions per project on software licenses and labor. The CAD+CAE+PLM software market is >US $30 B and growing and >5M mechanical engineers are working globally.  |
| **What's the company look like?***** | At scale, the company looks like a high-margin software company. Autodesk ($63B market cap) is a good comp. |

*There are market risks. (a) It's unclear what the product should be and (b) mechanical engineers, compared to software engineers, adopt new tooling less quickly. 

**I'm less clear on the details here. I would need to spell out the specific capability advances required to make this possible. 

***A critique of this proposal is that the "biggest company" examples are only in the 50-75B market cap range. In other words, it will be hard to become a >$1T company by being a software solution for mech engineers. Not sure this is really a requirement for X… but worth noting. 