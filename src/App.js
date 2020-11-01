import React from 'react';
import './App.scss';
import { LocationOn,
        LocalPhone,
        Share,
        Code,
        School,
} from '@material-ui/icons';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      skills : [ //make these links?
        'ReactJS',
        'Meteor',
        'EmberJS',
        'JavaScript',
        'Java (with some Spring)',
        'C# (Core)',
        'RabbitMQ',
        'MongoDB/NoSQL',
        'PostgresSQL',
        'MySQL',
        'Protobuffers',
        'ElasticSearch',
        'REST',
        'Git',
        'Selenium',
        'HTML',
        'SASS/Stylus/CSS',
        'npm',
        'Agile/Scrum',
      ],
      expertise: [
        'Front-end Development',
        'Component-ized, Modular Design',
        'Object Oriented Programming',
        'Agile/Scrum Best Practices',
        'Quality Assurance Best Practices',
        'Usability',
        'Communication',
      ]
    }
  }

  renderLeftColumn() {
    const { skills, expertise } = this.state;
    return (
      <div className="left-column">
        <h4>Contact</h4>
          {this.renderContact()}
        <h4>Skills</h4>
        <ul>
        {
          skills.map((skill) => {
            return (<li key={skill} className="skill-item">{skill}</li>);
          })
        }
        </ul>
        <h4>Expertise</h4>
        <ul>
        {
          expertise.map((skill) => {
            return (<li key={skill} className="skill-item">{skill}</li>);
          })
        }
        </ul>
        <h4>Education</h4>
        <ul className="list-with-icon">
          <li><School /> B.S. in Computer Science from Dickinson College - Carlisle, PA</li>
          <li><School /> Graduate from Gilman School - Baltimore, MD</li>
        </ul>
      </div>
    )
  }

  renderContact() {
    const mapsUrl = "https://www.google.com/maps/place/Arlington+County,+Arlington,+VA/@38.8807956,-77.172196,12z/data=!3m1!4b1!4m5!3m4!1s0x89b7b69d7ba7a70f:0xe08603603385be34!8m2!3d38.8816208!4d-77.0909809";
    return (
      <ul className="list-with-icon">
        <li key="location"><LocationOn /> <a href={mapsUrl}>Arlington, Virginia</a></li>
        <li key="cell"><LocalPhone /> <a href="tel:3109621985">310.962.1985</a></li>
        <li key="linked-in"><Share /> <a href="https://www.linkedin.com/in/andrew-townsend-6876836/">LinkedIn</a></li>
        <li key="github"><Code /><a href="https://github.com/AndrewTownsend"> GitHub</a></li>
      </ul>
    )
  }

  // make this it's own function in case we want to add a picture or something.
  renderProfile() {
    return (
      <p>
        My name is Andrew, and I'm a resourceful and communicative Full Stack Software Engineer and Application Developer, with a bias towards working on the front-end of applications.  I've worked on both the Development side of Agile teams as well as the QA side since 2008, at both large technology companies and startups.  I have a particular fondness for working with ReactJS.
      </p>
    )
  }
  
  render() {
    return (
      <div className="app">
        <header className="header-wrapper">
          <div className="header">
            <h1>Andrew V. Townsend</h1>
            <hr />
            <h2>Full Stack Software Engineer / Nerd</h2>
            <h3>View this page's source on my <a href="https://github.com/AndrewTownsend/roohaha">github!</a></h3>
            <h4>Mobile-friendly version coming soon!</h4>
          </div>
          <div className="left-column"></div>
          <div className="right-column"></div>
        </header>
        <div id="main">
          {this.renderLeftColumn()}
          <div className="right-column">
            <h4>Professional Profile</h4>
            {this.renderProfile()}
            <h4>Work Experience</h4>
            <span className="job-item">IDS International: Cyber &amp; Information Warfare: Full Stack Software Developer<span className="job-dates">October 2019 – October 2020</span></span>
            <ul>
                <li>Designed and was team lead to implement a clone of Snapchat in ReactJS/Meteor/MongoDB.</li>
                <li>Contributed to new features, bugfixes, and refactorings for clones of Twitter, Facebook, Google, Youtube, Instagram in ReactJS/Meteor/MongoDB.</li>
                <li>Prototyped an Event Bus model using RabbitMQ and Google Protobuffers to allow for high-speed logging of user activity across a simulated internet.</li>
                <li>Wrote load test rigs and associated scripts that could load test applications that use Web Sockets.</li>
                <li>Wrote a full suite of Selenium E2E tests as well as a suite of API tests for our Facebook clone.</li>
                <li>Contributed in general to building “Cyber Ranges” that served as simulated Internet environments, air-gapped from the real web.</li>
                <li>Provided insight on how we should be using GitFlow across the team.</li>
            </ul>
            <span className="job-item">Resonate: Full Stack Engineer<span className="job-dates">March 2018 – June 2019</span></span>
            <ul>
                <li>Work with a 5-7-member group to design, build, test, and deploy new features to our platform.</li>
                <li>Proficient in crafting components and features for our platform in EmberJS, JavaScript, Handlebars, and CSS.</li>
                <li>Learning middleware development with Java and Spring-based technologies.</li>
                <li>Responsible for a variety of update scripts for our application’s PostgreSQL database.</li>
                <li>Responsible for writing and updating unit tests for new business logic in both front-end and middleware.</li>
                <li>Perform code reviews for front-end and database merge requests.</li>
                <li>Participate in design discussions for front-end and database development.</li>
                <li>Act as Release Manager on a rotation to deploy bundled releases of all application tiers to Production.</li>
                <li>Member of the On-Call rotation to assess root-cause and impact of incoming Customer Issues for all tiers of the platform architecture, and hotfixing them as necessary.</li>
                <li>Work with Product and Design teams for preliminary drafting of requirements, requirement changes, and pixel-perfect component implementation.</li>
            </ul>
            <span className="job-item">Resonate: Quality Engineer <span className="job-dates">August 2013 – March 2018</span></span>
            <ul>
                <li>Developed a unique Selenium framework in Java that models pages quicker with Navigator objects than the traditional Page Object method that uses WebElements, with the goal of making it open source.</li>
                <li>Co-authored a JavaScript-based Selenium suite, using Webdriver.io and Fitnesse that replaced our entire Java-based test suite.  The new implementation dramatically reduced test-run durations.</li>
                <li>Built and maintained our Selenium test suites, which test our web application, database, and APIs.  Eventually owned all platform-related selenium codebases and regression runs as the sole QA Engineer.</li>
                <li>Owner of test plan creation for all stages of development.</li>
                <li>Took part in preliminary design and requirements discussions to account for all use-cases.</li>
                <li>Acted as Release Manager on a rotation to deploy bundled releases of all application tiers to Production.</li>
                <li>Executed cross-team work with our front-end team, building features and components for our web application using EmberJS.  Acted as a front-end engineer while maintaining QA duties.</li>
                <li>Architect of the QA codebase, implementing standards and providing design direction.</li>
            </ul>
            <span className="job-item">Microsoft: Software Engineer II: Contextual Ads Environment Health (OSD)<span className="job-dates">September 2012 – July 2013</span></span>
            <ul>
                <li>Designed and developed an architecture that gathered real-time system metrics across discrete online environments, with performance, deployment, and crash data.  Multiple teams adopted the infrastructure.</li>
                <li>Wrote several log-mining scripts to collect system health as well as accompanying tools.</li>
                <li>Automated a daily Environment Health email report that compiled data from several disparate sources.</li>
                <li>Co-designed and implemented a fully extensible Dashboard for overall organization status, including business metrics, performance data, build statuses, and automated test status.</li>
                <li>Built automation that automatically sampled a running process once a week and gathered performance data on our critical serving components.  Leveraged an existing profiling tool.</li>
                <li>Partnered with component teams to improve our environments’ reliability, performance and health.</li>
                <li>Owned various instances of environmental capacity tests for our new online architecture.</li>
            </ul>
            <span className="job-item">Microsoft: Software Engineer in Test II: Contextual Ads Performance (OSD)<span className="job-dates">July 2011—September 2012</span></span>
            <ul>
                <li>Lead developer for all internal tool needs of the Performance team.  Headed up design, implementation, code reviews, and maintenance. Primarily employed the C# language.</li>
                <li>Owned half the Contextual Ads online components for all performance analysis and reports.</li>
                <li>Built an automated environment that executed performance runs against the daily build and generated an email report with a comparison against the previous run, including crash statistics.</li>
                <li>Developed a monitoring system that generates a report on a datacenter’s performance for a specified timeframe, along with information about deployments that occurred during that window and statistics on traffic. Provided comparison data to the previous timeframe.</li>
                <li>Automated 95% of the Performance Report our team builds several times a release.  Turned a 3-6 hour exercise into a 20-minute, mainly unattended task.</li>
                <li>Wrote an entirely new load test tool for one of the online components to replace an older, legacy system.</li>
            </ul>
            <span className="job-item">Microsoft: Software Engineer in Test II: SmartPricing (OSD)<span className="job-dates">July 2010—July 2011</span></span>
            <ul>
                <li>Owned test plan design, review, maintenance and execution of several SmartPricing components.</li>
                <li>Contributed to automation that functionally tested modules of SmartPricing Online and Offline components in a white box fashion using C#.</li>
                <li>Owned the automation used to check each new configuration for errors. One of few local experts on the Aqueduct workflow scheduling platform.</li>
                <li>Maintained a local sandbox deployment of the Aqueduct platform for all teams to use as a test bed.</li>
                <li>Designed and implemented a standard automation framework for testing E2E scenarios in Aqueduct.</li>
                <li>Drove the Test side of all releases to Pre-Production and Production environments for the Offline component.</li>
                <li>Responsible for drafting, testing, and delivering the Release Steps used to deploy the feature to Production.</li>
            </ul>
            <span className="job-item">Yahoo! Inc: Search Marketing Desktop Quality Engineer and Tools Developer<span className="job-dates">July 2008—July 2010</span></span>
            <ul>
                <li>Placed in the top 5% of Yahoo! employees before joining Microsoft.</li>
                <li>Wrote an automated test framework for Yahoo! Search Marketing Desktop that ran regression tests and integrated with standard Yahoo! reporting tools.</li>
                <li>Led development and maintenance efforts of multiple supporting tools used by the developer, quality engineering, user acceptance, and internationalization teams associated with the product.</li>
                <li>Active contributor to all aspects of Yahoo! Search Marketing Desktop for the application’s entire lifecycle, particularly in the area of Quality Engineering. Took a leadership role in developing the test strategies, test case maintenance, and test plan execution of the entire product.</li>
                <li>Took lead ownership of several full cycles of test strategy planning and test case creation, test plan execution, and pre- and post-launch support for major patch releases of the product.</li>
                <li>Wrote automated functional, performance, and UI test scripts for continuous integration regression testing of the product using the proprietary Y!FlexTester framework.</li>
                <li>Experienced with leveraging and integrating tools with existing internal Yahoo! testing frameworks.  Used shell scripting, Flex/ActionScript 3, and Java.</li>
            </ul>

          </div>
        </div>
      </div>
    );

    
  
  }
}