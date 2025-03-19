/**
 * CV Page Annotations Data
 * Contains the descriptive data for all annotated terms on the CV page
 */

// Add debug logging
console.log('CV Annotations: Script loading');

// IMPORTANT: Use the global itemData object directly, not window.itemData
// This could be a key part of the problem
itemData = {
  // Publications
  pub1: {
    title: "Grown, printed, and biologically augmented",
    doi: "10.1089/3dp.2016.0027",
    summary: "<a href='https://doi.org/10.1089/3dp.2016.0027' target='_blank'>Download publication</a><br><br>This paper presents a novel approach to creating wearable devices that combine 3D printing with synthetic biology. The work demonstrates a multimaterial printing process that creates channels and chambers suitable for housing engineered microorganisms. The resulting wearable device showcases how synthetic biology can be integrated into 3D printed structures for functional applications."
  },
  pub2: {
    title: "3D printed multimaterial microfluidic valve",
    doi: "10.1371/journal.pone.0160624",
    summary: "<a href='https://doi.org/10.1371/journal.pone.0160624' target='_blank'>Download publication</a><br><br>This research introduces a novel approach to creating functional valves within microfluidic devices using multimaterial 3D printing. The work demonstrates how combining rigid and flexible materials can create working mechanical components without assembly. The valve design enables precise fluid control in miniaturized systems."
  },
  pub3: {
    title: "DNA assembly in 3D printed fluidics",
    doi: "10.1371/journal.pone.0143636",
    summary: "<a href='https://doi.org/10.1371/journal.pone.0143636' target='_blank'>Download publication</a><br><br>This paper demonstrates the integration of synthetic biology protocols with 3D printed microfluidic devices. The work shows how Golden Gate DNA assembly can be performed in custom-printed fluidic chips, offering a new approach to automating synthetic biology workflows."
  },
  pub4: {
    title: "Better together: engineering and application of microbial symbioses",
    doi: "10.1016/j.copbio.2015.08.008",
    summary: "<a href='https://doi.org/10.1016/j.copbio.2015.08.008' target='_blank'>Download publication</a><br><br>This review paper examines the emerging field of engineered microbial communities. It covers recent advances in designing and controlling interactions between different microorganisms for applications in biotechnology, medicine, and environmental remediation."
  },
  pub5: {
    title: "Designing the Ocean Pavilion",
    doi: "10.5277/piass152213",
    summary: "<a href='https://www.ingentaconnect.com/content/iass/piass/2015/00002015/00000016/art00013' target='_blank'>Download publication</a><br><br>This paper presents novel methods for 3D printing with chitosan, a biodegradable polymer derived from crustacean shells. The research developed robotic fabrication techniques for precisely depositing and controlling the material properties of chitosan structures. The work demonstrates how industrial robotic arms can be adapted for biomaterial printing, enabling the creation of large-scale architectural structures with biologically-derived materials."
  },
  
  // Patents
  pat1: {
    title: "Bioprocessing systems and methods (US20180251795A1)",
    summary: "This patent covers innovative designs for bioprocessing systems, including multi-vessel configurations that enable parallel fermentation with integrated monitoring. It includes designs for sensors, control systems, and data processing that form the foundation of Culture Biosciences' cloud bioreactor platform."
  },
  pat2: {
    title: "Microfluidic devices and methods for cell sorting (US9956579B2)",
    summary: "This patent covers the design and fabrication of 3D printed microfluidic valves and flow control mechanisms for cell sorting applications. The technology enables precise control of fluid flow in miniaturized devices through the strategic use of multiple materials with different properties in a single printed structure."
  },
  pat3: {
    title: "Wearable hybrid devices for personal, medical, and health management applications (US10213646B2)",
    summary: "This patent covers wearable devices that combine additive manufacturing with engineered microorganisms. The technology integrates synthetic biology components into 3D printed structures to create functional devices capable of sensing environmental conditions and responding through engineered biological pathways."
  },
  
  // Additional patent entries
  pat4: {
    title: "Methods and systems for control of a fermentation system",
    summary: "This patent covers methods and systems for controlling fermentation processes, focusing on automated monitoring and regulation of bioprocessing parameters."
  },
  pat5: {
    title: "Balloon clumping to provide bandwidth requested in advance",
    summary: "This patent from X (formerly Google X) describes systems for positioning and clustering high-altitude balloons to provide internet connectivity to specific geographic areas based on predicted demand."
  },
  pat6: {
    title: "Request apparatus for delivery of medical support implement by UAV",
    summary: "This patent covers systems for requesting and dispatching unmanned aerial vehicles (UAVs) to deliver medical supplies and equipment in emergency situations."
  },
  pat7: {
    title: "Multi-part navigation process by an unmanned aerial vehicle for navigation",
    summary: "This patent details navigation methods for unmanned aerial vehicles, allowing them to efficiently navigate to destinations using multi-stage routing algorithms."
  },
  pat8: {
    title: "Providing services using unmanned aerial vehicles",
    summary: "This patent covers systems and methods for delivering various services using unmanned aerial vehicles, including logistics, monitoring, and emergency response capabilities."
  },
  pat9: {
    title: "Mechanisms for lowering a payload to the ground from a UAV",
    summary: "This patent describes mechanisms for safely deploying payloads from unmanned aerial vehicles to the ground without requiring the UAV to land."
  },
  pat10: {
    title: "Systems and methods for vertical takeoff and/or landing",
    summary: "This patent covers innovative designs for vertical takeoff and landing (VTOL) aircraft, focusing on energy-efficient transitions between vertical and horizontal flight."
  },
  pat11: {
    title: "Providing emergency medical services using unmanned aerial vehicles",
    summary: "This patent details systems for rapidly deploying emergency medical equipment and supplies via unmanned aerial vehicles to emergency situations."
  },
  pat12: {
    title: "Unlocking mobile-device and/or unmanned aerial vehicle capability in an emergency situation",
    summary: "This patent covers methods for automatically enabling additional capabilities in mobile devices and UAVs during emergency situations to enhance response effectiveness."
  },
  pat13: {
    title: "Providing a medical support device via an unmanned aerial vehicle",
    summary: "This patent describes systems for delivering specialized medical devices to emergency locations using unmanned aerial vehicles, including deployment and operation procedures."
  },
  pat14: {
    title: "Multi-part navigation process by an unmanned aerial vehicle for navigating to a medical situation",
    summary: "This patent details sophisticated navigation systems for directing unmanned aerial vehicles to medical emergencies, considering factors like obstacles, weather, and prioritization."
  },
  pat15: {
    title: "Responsive navigation of an unmanned aerial vehicle to a remedial facility",
    summary: "This patent covers systems enabling UAVs to autonomously navigate to appropriate facilities for maintenance, repair, or refueling based on their operational status and mission requirements."
  },
  pat16: {
    title: "System and method of generating images on photoactive surfaces",
    summary: "This patent from X's Rapid Evaluation team describes systems for creating dynamic visual displays using photoactive materials that can change appearance in response to light stimulation."
  },
  pat17: {
    title: "Method, apparatus and system for projecting light for user guidance",
    summary: "This patent covers systems that use projected light patterns to provide visual guidance and information to users in various environments."
  },
  pat18: {
    title: "Method and apparatus for dynamic signage using a painted surface display system",
    summary: "This patent describes technology for creating changeable displays on painted surfaces, allowing walls and other painted areas to function as dynamic digital signage."
  },
  pat19: {
    title: "Method and apparatus for gesture interaction with a photo-active painted surface",
    summary: "This patent covers interactive systems that allow users to control and interact with photoactive surfaces through gestures, creating responsive environments."
  },
  pat20: {
    title: "Method and apparatus for themes using photo-active surface paint",
    summary: "This patent describes systems for implementing changeable thematic displays using photoactive paints that can be controlled to create different visual environments."
  },
  pat21: {
    title: "Method, apparatus and system for adaptive light projection",
    summary: "This patent covers systems for projecting light in ways that adapt to the environment and user needs, creating context-aware illumination and information displays."
  },
  
  // Career and Organizations
  "culture-biosciences": {
    title: "Culture Biosciences",
    summary: "Culture Biosciences is a cloud biomanufacturing company founded by Will Patrick and Matt Ball in 2016. The company provides remote access to bioreactors, enabling scientists to run experiments through a web-based platform without needing to set up or maintain their own hardware. Culture's technology helps accelerate bioprocess development for companies in biopharma, synthetic biology, and industrial biotechnology. <a href='https://culturebiosciences.com/' target='_blank'>Visit Culture Biosciences</a>"
  },
  "cloud-bioreactor": {
    title: "Cloud Bioreactor Technology",
    summary: "Cloud bioreactors are fermentation systems that can be operated remotely via the internet. Culture's platform allows scientists to design experiments through a web interface and have them run in Culture's lab, with real-time data streaming and remote control. This technology significantly reduces capital expenditure and speeds up bioprocess development by eliminating hardware setup and maintenance time."
  },
  "cloud-bioreactor-platform": {
    title: "Cloud Bioreactor Platform",
    summary: "Culture's cloud bioreactor platform combines hardware automation, software, and laboratory operations to enable remote bioprocess development. Scientists can design experiments through a web interface, monitor processes in real-time, and receive samples without setting foot in the lab. The platform includes experiment design tools, data visualization, and integration with laboratory information management systems (LIMS)."
  },
  "culture-console": {
    title: "Culture Console",
    summary: "The Culture Console is a web application that serves as the primary interface for Culture's cloud bioreactor platform. It allows users to design experiments, monitor runs in real-time, analyze data, and collaborate with team members. The console provides real-time visualization of process parameters, customizable dashboards, and tools for comparing runs and scaling bioprocesses."
  },
  "stratyx-250": {
    title: "Stratyx 250",
    summary: "The Stratyx 250 is Culture Biosciences' first commercial bioreactor system designed for customers to purchase and install in their own facilities. It combines cloud connectivity with advanced hardware design to enable remote operation and monitoring. The system includes integrated sensors, automated sampling, and direct integration with Culture's Console software for data analysis and visualization."
  },
  "biotech-collaborations": {
    title: "Culture's Industry Collaborations",
    summary: "Over its history, Culture Biosciences established partnerships with more than 75 companies, ranging from early-stage startups to large pharmaceutical and industrial biotechnology firms. These collaborations helped clients accelerate their bioprocess development timelines, improve productivity, and reduce costs compared to traditional in-house bioprocess development approaches."
  },
  "cytiva-partnership": {
    title: "Cytiva Partnership",
    summary: "In 2021, Culture Biosciences announced a strategic partnership with Cytiva (formerly GE Healthcare Life Sciences), a global provider of technologies and services for pharmaceutical and biotech manufacturing. The partnership aimed to integrate Cytiva's hardware and media formulations with Culture's cloud bioreactor platform to expand offerings and accelerate bioprocess development for joint customers."
  },
  "upstream-bioprocess": {
    title: "Upstream Bioprocessing",
    summary: "Upstream bioprocessing refers to the initial stages of bioprocess development, including strain engineering, media optimization, and fermentation process development. This phase focuses on optimizing the growth conditions for microorganisms or cell cultures to maximize production of a target molecule. Improvements in upstream bioprocessing can significantly increase the overall yield and efficiency of biological manufacturing processes."
  },
  "digital-fabrication": {
    title: "Digital Fabrication",
    summary: "Digital fabrication refers to manufacturing processes that translate digital designs directly into physical objects. Technologies include 3D printing, CNC machining, and laser cutting. In Will's research at MIT, digital fabrication was used to create complex microfluidic structures, biologically integrated devices, and novel materials with precisely controlled properties."
  },
  "microfluidics": {
    title: "3D Printed Microfluidics",
    summary: "3D printed microfluidics refers to the use of additive manufacturing technologies to create microscale channels and chambers for controlling fluid flow. Will's research at MIT developed methods for printing microfluidic devices with functional components such as valves and mixers, enabling complex fluid manipulations for biological applications including DNA assembly and synthetic biology."
  },
  "x-lab": {
    title: "X (formerly Google X)",
    summary: "X is Alphabet's innovation lab (formerly known as Google X) where moonshot technologies are developed. The organization works on radical solutions to major global challenges, aiming to create breakthrough technologies that can have exponential impact. Projects that have emerged from X include Waymo (self-driving cars), Wing (drone delivery), and Loon (internet balloons). <a href='https://x.company/' target='_blank'>Visit X's website</a>"
  },
  "rapid-evaluator": {
    title: "Rapid Evaluator at X",
    summary: "The Rapid Evaluator role at X involves quickly assessing new ideas for potential moonshot projects. Rapid Evaluators conduct experiments, build prototypes, and analyze technologies to determine if concepts are technically feasible and could potentially develop into X projects. They work across disciplines to rapidly test and iterate on early-stage ideas before they become full-fledged projects."
  },
  "wing": {
    title: "Wing",
    summary: "Wing is Alphabet's drone delivery service that emerged from X. The project developed autonomous delivery drones and an air traffic management system to enable safe and efficient delivery of small packages. Wing became one of the first drone delivery companies to receive Air Carrier certification from the FAA and now operates commercial services in multiple countries. <a href='https://wing.com/' target='_blank'>Visit Wing's website</a>"
  },
  "solve-for-x": {
    title: "Solve for X",
    summary: "Solve for X was a Google initiative that fostered moonshot thinking through conferences and community engagement. The program brought together entrepreneurs, innovators, and scientists to discuss radical solutions to global challenges. Solve for X events featured talks on breakthrough technologies and encouraged collaboration between experts from diverse fields to tackle humanity's grand challenges."
  },
  "google-glass": {
    title: "Google Glass",
    summary: "Google Glass was a wearable computer featuring a head-mounted display in the form of eyeglasses. The device displayed information in a hands-free format and could take photos, record video, and perform tasks through natural language voice commands. Though the consumer version was discontinued, Google Glass evolved into an Enterprise Edition that continues to be used in industrial, medical, and professional settings."
  },
  "embrace": {
    title: "Embrace",
    summary: "Embrace is a social enterprise that developed a low-cost infant warmer resembling a sleeping bag. The innovative design uses phase-change material to maintain a consistent temperature for premature and low-birth-weight infants, providing a radically affordable alternative to traditional incubators. Embrace warmers have been distributed across developing countries, helping to address infant mortality in resource-constrained settings. <a href='https://embraceinnovations.com/' target='_blank'>Learn more about Embrace</a>"
  },
  "duron-energy": {
    title: "Duron Energy",
    summary: "Duron Energy (formerly D.light Design) is a company that provides solar-powered products for off-grid communities. Their product line includes solar lanterns and home lighting systems designed to replace kerosene lamps in developing countries. The company's mission is to improve quality of life for people without reliable electricity access by providing affordable, durable, and user-friendly solar power solutions."
  },
  "mit-media-lab": {
    title: "MIT Media Lab",
    summary: "The MIT Media Lab is an interdisciplinary research laboratory at the Massachusetts Institute of Technology that focuses on the convergence of technology, multimedia, science, art, and design. Founded in 1985, the lab is known for its innovative approach to research and its 'demo or die' philosophy, emphasizing working prototypes over traditional academic papers. <a href='https://www.media.mit.edu/' target='_blank'>Visit MIT Media Lab's website</a>"
  },
  "mit-media-lab-edu": {
    title: "MIT Media Lab Graduate Program",
    summary: "The Media Lab's graduate program offers a unique research-based approach that transcends traditional academic boundaries. Students in the program pursue cutting-edge research in areas that often fall between established disciplines. The program emphasizes learning through building and experimentation, with students working closely with faculty on groundbreaking projects that combine technology, design, and human experience."
  },
  "mediated-matter": {
    title: "Mediated Matter Group",
    summary: "The Mediated Matter group at MIT Media Lab focuses on nature-inspired design and digital fabrication. The group explores how digital manufacturing, computational design, and synthetic biology can intersect to create new materials and structures. Research areas include 3D printing with novel materials, biologically-inspired design, and the development of new fabrication platforms that bridge digital and biological worlds."
  },
  "neri-oxman": {
    title: "Neri Oxman",
    summary: "Professor Neri Oxman is a renowned architect, designer, and inventor who founded and directed the Mediated Matter group at MIT Media Lab. Her work combines computational design, digital fabrication, materials science, and synthetic biology. She pioneered the field of Material Ecology, which considers computation, fabrication, and the material itself as inseparable dimensions of design. <a href='https://oxman.com/' target='_blank'>Visit Neri Oxman's website</a>"
  },
  "media-lab-masters": {
    title: "Master of Science Program at MIT Media Lab",
    summary: "The Media Lab's Master of Science program is a unique two-year research-based degree that emphasizes learning through creation and exploration. Students are fully funded and work closely with faculty on groundbreaking research projects. The program is highly selective, admitting students based on their potential to pioneer new approaches at the intersection of technology, science, art, and design. Unlike traditional departments, students work across disciplines and are encouraged to develop novel solutions to real-world problems."
  },
  "silver-lab": {
    title: "Silver Lab at Harvard Medical School",
    summary: "The Silver Lab at Harvard Medical School, led by Professor Pamela Silver, focuses on synthetic biology approaches to designing and building biological systems. The lab's research includes engineering cells for medical applications, bioproduction of chemicals, and creating biological sensors. Their work spans basic science to applications in health, energy, and the environment."
  },
  "lincoln-lab": {
    title: "MIT Lincoln Laboratory",
    summary: "MIT Lincoln Laboratory is a United States Department of Defense research center operated by the Massachusetts Institute of Technology. The laboratory conducts research and development in advanced electronics, with a focus on sensors, information processing, and communications. Its work spans areas including air and missile defense, space systems, cyber security, and bioengineering."
  },
  "voigt-lab": {
    title: "MIT Voigt Lab",
    summary: "The Voigt Lab at MIT, led by Professor Christopher Voigt, is a pioneer in synthetic biology research. The lab develops new genetic parts, devices, and systems to program cells with complex functions. Their research includes creating computational tools for designing genetic circuits, engineering microbes for applications in health and industry, and developing standardized biological parts."
  }
}; 