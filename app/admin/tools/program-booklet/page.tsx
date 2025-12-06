'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaDownload, FaBook, FaPlus, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import jsPDF from 'jspdf';

interface PageContent {
  id: string;
  pageNumber: number;
  type: 'cover' | 'message' | 'facilitator' | 'agenda' | 'acknowledgements' | 'thanks' | 'blank';
  title?: string;
  subtitle?: string;
  content?: string;
  author?: string;
  authorTitle?: string;
  organization?: string;
  sessionOverview?: string;
  imageUrl?: string;
}

// Default Y360 Program Booklet Content
const defaultPages: PageContent[] = [
  {
    id: '1',
    pageNumber: 1,
    type: 'cover',
    title: 'Y360',
    subtitle: 'Technology and Trade\nExploration Experience',
    content: 'DECEMBER 6, 2025\n"THE GREEN DOOR"\n130 RAILROAD AVENUE\nGIBSONVILLE, NC\n10 AM UNTIL 2 PM\n\n(BREAKFAST AND PRE-SURVEY 9 AM UNTIL 9:50 AM)',
  },
  {
    id: '2',
    pageNumber: 2,
    type: 'message',
    title: 'Welcome Message',
    content: 'The Technology and Trades Exploration 2025 event is one that the Town of Gibsonville is completely behind. Not only is it filling in the gaps of education that will be needed by children and adults to be successful in the future, but it also addresses basic life skills that every person should have.\n\nThis program will touch on subjects such as: AI & Robotics, skilled trades, family wellness and nutrition, etc. Furthermore, the opportunity for intergenerational learning is a new and different way of looking at the learning process.\n\nThese types of programs run by individuals that are forward thinking are what will carry us into 2026 and beyond!',
    author: 'Bryant Crisp',
    authorTitle: 'Mayor-Elect Town of Gibsonville',
  },
  {
    id: '3',
    pageNumber: 3,
    type: 'message',
    title: 'Welcome to the Youth360 Program!',
    subtitle: '"Together We Grow, Together We Shine."',
    content: 'Hello Everyone,\n\nWe\'re excited to kick off this program with you! This is more than just an event—it\'s a chance for all of us to learn, share ideas, and build something meaningful together. This program is about creating opportunities, building connections, and celebrating the strengths each person brings. We\'re grateful you\'ve chosen to be part of this journey, and we can\'t wait to see what we accomplish as a team.\n\nCall-to-Action:\nThis program isn\'t just about showing up, it\'s about opening doors. Take a moment to introduce yourself and share whether you\'re looking to learn new skills, meet people who inspire you, or take that first step toward your career goals, this is your chance to make it happen—whatever excites you most!\n\nLet\'s make this experience positive, inspiring, and full of energy then go back and invite your friends. Thank you for being here—your participation makes all the difference.',
    author: 'Veronica Revels',
    authorTitle: 'CEO/President',
  },
  {
    id: '4',
    pageNumber: 4,
    type: 'message',
    title: 'Cappadocia Intergrowth Enrichment Outreach',
    content: 'On behalf of Cappadocia Intergrowth Enrichment Outreach, it is my honor and joy to welcome you to the Youth 360 Community Event. As a proud partner in this initiative, our organization has been deeply committed to supporting every aspect of the planning and preparation that brings this impactful gathering to life.\n\nAt Cappadocia, we believe in cultivating spaces where young people can grow, explore their potential, and feel empowered to shape their future. The Youth 360 program reflects this very mission—bringing together resources, mentorship, education, and community unity to uplift the next generation.\n\nIt has been inspiring to witness the collaboration of so many dedicated leaders, volunteers, and organizations throughout Gibsonville and beyond.\n\nTo all the amazing people here today: know that you are valued, supported, and celebrated. Your journey matters, and we are honored to walk alongside you.\n\nThank you for allowing Cappadocia Intergrowth Enrichment Outreach to be part of this transformative event. We look forward to continuing our work together.',
    author: 'Mrs. Shiron Bigelow',
    authorTitle: 'Executive Director',
    organization: 'Cappadocia Intergrowth Enrichment Outreach',
  },
  {
    id: '5',
    pageNumber: 5,
    type: 'blank',
  },
  {
    id: '6',
    pageNumber: 6,
    type: 'message',
    title: 'Missing Ingredients, LLC',
    content: 'At Missing Ingredients, we believe that every person (young or grown) carries tremendous potential. Sometimes all that\'s needed is access, encouragement, and the right environment for those untapped "missing ingredients" to rise to the surface. That is why being part of the Youth 360 initiative has been more than partnership for us; it has been purpose.\n\nYouth 360 is not simply an event, it is a platform where skills are discovered, confidence is built, and opportunities begin to take shape. For our adult participants, it strengthens pathways to employability and opens doors to careers that once felt out of reach. For our youth, it creates early exposure to possibility, showing them that their talents can become tools for their future.\n\nWe are honored to contribute to a program that invests so deeply in people. When young people see themselves reflected in success, they aim higher. These are not just outcomes; they are catalysts for generational change.\n\nTo every participant here today: remember that you are capable, prepared, and worthy of every opportunity coming your way. And to our fellow partners and supporters: thank you for shaping spaces where growth is not only encouraged but expected.',
    author: 'Dr. Lei Ferguson-Washington',
    authorTitle: 'Founder and Research and Evaluation Specialist',
    organization: 'Missing Ingredients, LLC',
  },
  {
    id: '7',
    pageNumber: 7,
    type: 'message',
    title: 'Leadership C.O.N.N.E.C.T.I.O.N.S.',
    content: 'Welcome to Youth360, a program designed to help you develop practical skills that will prepare you for future employment and empower you to make a positive impact in your community. We encourage you to engage actively throughout the program, connect with fellow participants, and take full advantage of this valuable opportunity.\n\nWe are proud to introduce our experienced training team. Their dedication and commitment to service are deeply appreciated, and we thank them for their ongoing support and hard work.\n\nLeadership C.O.N.N.E.C.T.I.O.N.S. has evolved over more than 35 years into an inclusive and impactful initiative.\n\nOn behalf of the Leadership C.O.N.N.E.C.T.I.O.N.S. organization, I want to extend my heartfelt gratitude to all Funders, Program Participants, Collaborators, Volunteers, and the Y360 Training Team. Your steadfast support has been invaluable to the success of today\'s event.\n\nBy working together, we strive to create positive changes in communities. Please enjoy your day!',
    author: 'Katherine Harrelson',
    authorTitle: 'Founder/Volunteer Director',
    organization: 'Leadership C.O.N.N.E.C.T.I.O.N.S',
  },
  {
    id: '8',
    pageNumber: 8,
    type: 'facilitator',
    title: 'Meet Your Y360 Facilitators',
    subtitle: 'Trades Exploration - Gloria Bass',
    content: 'Gloria Bass is a dynamic professional distinguished by exceptional leadership in architecture, construction, and community service. They hold a solid educational foundation from NC A&T State University and Guildford Technical Community College, complemented by technical expertise in blueprint reading, codes enforcement, Revit, and more.\n\nTheir hands-on construction experience spans carpentry, plumbing, electrical, and tiny house construction, reflecting great technical proficiency. In their professional roles, including Office Manager at National Robe Corporation, they have overseen complex operations, and at Lindley Habilitation Services, they supervise and rehabilitate skills for individuals with disabilities.\n\nBeyond work, Gloria is an active volunteer with organizations like Habitat For Humanity and the Women\'s Foundation of North Carolina, focusing on youth empowerment and resource advocacy.',
    sessionOverview: 'To train youth in the trade of construction, brick masonry/carpentry. With these teachings and training, each youth will be EMPOWERED to create a trade, design a structure, for a lifetime—whether an architect or a contractor. With each creation, youth will leave a legacy for generations to come.',
  },
  {
    id: '9',
    pageNumber: 9,
    type: 'facilitator',
    title: 'Red Carpet Kids Health and Wellness',
    subtitle: 'Ty Gibson known as "Ty G"',
    content: '"What\'s poppin\' no popcorn!" Ty Gibson, also known as \'Ty G,\' is a professional Actor, Clean Comedian, and Entertainer based in Greensboro, NC. In addition to his creative pursuits, he serves as the \'Let\'s Move\' Ambassador for Red Carpet Kids, USA.\n\nThis role is part of Youth 360\'s intergenerational program, powered by Women\'s Foundation of North Carolina, d.b.a. Leadership C.O.N.N.E.C.T.I.O.N.S., Inc., where he advocates for nutrition, fitness, heart health, and overall wellness across all generations.',
    sessionOverview: 'A youth led project that promotes heart health, fitness, wellness and nutrition to encourage artistic enrichment and creative leadership development. The center is also designed to enhance leadership among youth to help build communities.\n\n"Enrich, Engage, Empower"\n• ENRICH the lives of youth by providing leadership opportunities\n• ENGAGE youth by developing a peer-to-peer community\n• EMPOWER youth by fostering positive bonding opportunities',
  },
  {
    id: '10',
    pageNumber: 10,
    type: 'facilitator',
    title: 'Peer-to-Peer Mentoring Training',
    subtitle: 'Thea Monet',
    content: 'Thea Monet, a retiree, has dedicated over five decades to advancing health, education, and wellness through leadership roles in community, government, and nonprofit organizations.\n\nKnown for innovative service, unwavering advocacy, and heartfelt mentorship, Thea\'s impact is recognized through countless awards, including the Order of the Long Leaf Pine and the Presidential Lifetime Achievement Award.\n\nShe remains deeply thankful for her family, mentors, and every step of her journey, continuing her work through WICK Enterprise, community volunteering, and creative collaboration.',
    sessionOverview: 'This session prepares adults to become effective peer mentors who champion community advocacy, civic responsiveness, and volunteerism. Participants will explore how to use their experiences and strengths to guide others, build confidence, and encourage informed community involvement.',
  },
  {
    id: '11',
    pageNumber: 11,
    type: 'facilitator',
    title: 'Technology Exploration (Robotics)',
    subtitle: 'Brian Stitt',
    content: 'Brian E. Stitt is an Instructional Technologist, Automation Specialist, and Adjunct Professor at Wake Technical Community College, where he teaches robotics and PLC programming using Allen Bradley PLCs and Fanuc robotic arms.\n\nWith over 20 years of experience at the U.S. Environmental Protection Agency designing IT and automation solutions, Brian brings deep expertise in educational robotics, AI instruction, and advanced manufacturing.\n\nHis pioneering work developing Mitsubishi Robotics training materials at Bowling Green State University catalyzed the creation of a new Mechatronics Engineering Technology degree program.',
    sessionOverview: 'This fast-paced, engaging session introduces participants to the exciting world of artificial intelligence and robotics through live demonstrations with the DJI RoboMaster EP Core. Participants will see AI and robotics in action, explore real-world applications, and discuss both the opportunities and concerns surrounding these transformative technologies.',
  },
  {
    id: '12',
    pageNumber: 12,
    type: 'facilitator',
    title: 'Technology Exploration (Robotics)',
    subtitle: 'Donald Sweeper',
    content: 'Donald E. Sweeper, known to many as The Drone Whisperer, is an Emerging Technology STEAM Education Alchemist specializing in AI, robotics, animatronics, and UAV innovation.\n\nAs the founder of SweepWorX and the Emerging Technology STEAM Leader at Quality Education Academy, he designs immersive tech-driven learning experiences that prepare students for the future.\n\nDonald also serves as an adjunct professor at the University of North Carolina School of the Arts, where he blends AI with the arts through animatronics, digital twins, and creative robotics.\n\n"Focus on what you Can do, not what you Cannot" ~ D. Sweeper',
    sessionOverview: 'We will provide students with the opportunity to observe emerging technology demonstrations (robots and drones), learn how these technologies work and discover how to solve problems. In person engagement meeting for 3 hours for this STEM education session.',
  },
  {
    id: '13',
    pageNumber: 13,
    type: 'facilitator',
    title: 'Red Carpet Kids Health and Wellness',
    subtitle: 'India Warner',
    content: 'India Warner is a dedicated professional with a Bachelor of Arts in Criminal Justice from East Carolina University. She is SERV Safe Certified, demonstrating expertise in food safety and sanitation principles.\n\nHer experience as a Chef at Chili\'s involved properly learning and executing recipe procedures and working as part of a team to prepare and serve orders. She further utilized her skills as a Server, providing quality customer service in a fast-paced environment.\n\nBeyond the culinary and hospitality fields, India holds certifications including First Aid/CPR Certified and NCI Core Certified. Her strong soft skills, including adaptability, attention to detail, and creative problem-solving, equip her for diverse professional challenges.',
    sessionOverview: 'We will focus on teaching the fundamentals of healthy nutrition, the practical skill of meal preparation and kitchen safety, emphasizing how these habits support heart health and overall wellness. The session aims to be highly practical, providing participants with simple, actionable steps they can implement immediately.',
  },
  {
    id: '14',
    pageNumber: 14,
    type: 'agenda',
    title: 'Agenda of the Day',
    content: 'Ground Rules:\n• Youth participants must notify staff of the need to leave the classroom\n• Be Respectful at ALL times\n• Use safety at ALL times\n• No running or horseplaying at ANY time\n• Wait to be called on before you speak\n\nSESSION SCHEDULE:\n\nEngineers (Blue):\n• 10:00-10:50 AM: Trades Exploration\n• 11:00-11:50 AM: Red Carpet Kids\n• 12:00-12:50 PM: Technology Exploration\n\nArchitects (Green):\n• 10:00-10:50 AM: Red Carpet Kids\n• 11:00-11:50 AM: Technology Exploration\n• 12:00-12:50 PM: Trades Exploration\n\nContractors (Yellow):\n• 10:00-10:50 AM: Technology Exploration\n• 11:00-11:50 AM: Trades Exploration\n• 12:00-12:50 PM: Red Carpet Kids',
  },
  {
    id: '15',
    pageNumber: 15,
    type: 'acknowledgements',
    title: 'Acknowledgements',
    content: 'FUNDING PARTNERS:\n• Guilford County CBO\n• Town of Gibsonville\n• Burlington Development Corporation Investment Communities, LLC\n• Gibsonville Square\n\nCONTRIBUTING PARTNERS:\n• Missing Ingredients, LLC\n• Cappadocia Intergrowth Enrichment Outreach\n• Pathway to Our Future\n• Tummy Thyme\n• Food Pantry of the Triad\n• Oak Street Health\n• Landon Cohen\n• Gibsonville Fire Department\n• Mr. Allan Blue-BDCIC\n• The Women\'s Foundation of North Carolina\n• Mr. Karenga Arifu-GSO Parks and Recreation\n• Guilford County Sheriff\'s Department\n• Gibsonville Police Department',
  },
  {
    id: '16',
    pageNumber: 16,
    type: 'thanks',
    title: 'Special Thanks',
    subtitle: 'Gibsonville Square',
    content: 'For the building usage for today!\n\n~The Y360 Team and Partners',
  },
];

export default function ProgramBookletPage() {
  const [pages, setPages] = useState<PageContent[]>(defaultPages);
  const [eventTitle, setEventTitle] = useState('Leadership C.O.N.N.E.C.T.I.O.N.S.');
  const [eventSubtitle, setEventSubtitle] = useState('PRESENTS');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/images/logo/LeadershipConnectionsLogo.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  const updatePage = (id: string, updates: Partial<PageContent>) => {
    setPages(pages.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    const pageWidth = 215.9;
    const pageHeight = 279.4;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    pages.forEach((page, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Page number (except cover)
      if (page.type !== 'cover' && page.type !== 'blank') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(String(page.pageNumber), pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      if (page.type === 'blank') {
        // Just add page number
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(String(page.pageNumber), pageWidth / 2, pageHeight - 10, { align: 'center' });
        return;
      }

      if (page.type === 'cover') {
        // Cover page
        let y = 30;

        // Logo
        if (logoBase64) {
          const logoWidth = 40;
          const logoHeight = 28;
          doc.addImage(logoBase64, 'PNG', (pageWidth - logoWidth) / 2, y, logoWidth, logoHeight);
          y += logoHeight + 10;
        }

        // Organization name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text(eventTitle, pageWidth / 2, y, { align: 'center' });
        y += 12;

        // Presents
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(eventSubtitle, pageWidth / 2, y, { align: 'center' });
        y += 25;

        // Main title (Y360)
        if (page.title) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(48);
          doc.setTextColor(79, 70, 229); // Primary purple
          doc.text(page.title, pageWidth / 2, y, { align: 'center' });
          y += 20;
        }

        // Subtitle
        if (page.subtitle) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(18);
          doc.setTextColor(30, 41, 59);
          const subtitleLines = page.subtitle.split('\n');
          subtitleLines.forEach(line => {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
            y += 8;
          });
          y += 20;
        }

        // Event details
        if (page.content) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor(60, 60, 60);
          const contentLines = page.content.split('\n');
          contentLines.forEach(line => {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
            y += 7;
          });
        }

      } else if (page.type === 'message') {
        let y = margin + 10;

        // Title
        if (page.title) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.setTextColor(30, 41, 59);
          doc.text(page.title, pageWidth / 2, y, { align: 'center' });
          y += 10;
        }

        // Subtitle
        if (page.subtitle) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(12);
          doc.setTextColor(79, 70, 229);
          doc.text(page.subtitle, pageWidth / 2, y, { align: 'center' });
          y += 12;
        }

        // Content
        if (page.content) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(page.content, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 4.5 + 15;
        }

        // Author signature
        if (page.author) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59);
          doc.text(page.author, margin, y);
          y += 5;

          if (page.authorTitle) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(page.authorTitle, margin, y);
            y += 5;
          }

          if (page.organization) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(page.organization, margin, y);
          }
        }

      } else if (page.type === 'facilitator') {
        let y = margin + 10;

        // Title
        if (page.title) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(79, 70, 229);
          doc.text(page.title, pageWidth / 2, y, { align: 'center' });
          y += 10;
        }

        // Facilitator name
        if (page.subtitle) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(30, 41, 59);
          doc.text(page.subtitle, pageWidth / 2, y, { align: 'center' });
          y += 15;
        }

        // Bio
        if (page.content) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(page.content, contentWidth);
          doc.text(lines, margin, y);
          y += lines.length * 4.5 + 10;
        }

        // Session Overview box
        if (page.sessionOverview) {
          // Draw box
          doc.setFillColor(245, 245, 250);
          doc.setDrawColor(79, 70, 229);
          doc.roundedRect(margin, y, contentWidth, 50, 3, 3, 'FD');
          y += 8;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(79, 70, 229);
          doc.text('SESSION OVERVIEW', margin + 5, y);
          y += 7;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          const overviewLines = doc.splitTextToSize(page.sessionOverview, contentWidth - 10);
          doc.text(overviewLines, margin + 5, y);
        }

      } else if (page.type === 'agenda') {
        let y = margin + 10;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text(page.title || 'Agenda', pageWidth / 2, y, { align: 'center' });
        y += 15;

        // Content
        if (page.content) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(page.content, contentWidth);
          doc.text(lines, margin, y);
        }

      } else if (page.type === 'acknowledgements') {
        let y = margin + 10;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text(page.title || 'Acknowledgements', pageWidth / 2, y, { align: 'center' });
        y += 15;

        // Content
        if (page.content) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          const lines = doc.splitTextToSize(page.content, contentWidth);
          doc.text(lines, margin, y);
        }

      } else if (page.type === 'thanks') {
        let y = pageHeight / 2 - 30;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229);
        doc.text(page.title || 'Special Thanks', pageWidth / 2, y, { align: 'center' });
        y += 20;

        // Subtitle
        if (page.subtitle) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.setTextColor(30, 41, 59);
          doc.text(page.subtitle, pageWidth / 2, y, { align: 'center' });
          y += 15;
        }

        // Content
        if (page.content) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(14);
          doc.setTextColor(100, 100, 100);
          const lines = page.content.split('\n');
          lines.forEach(line => {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
            y += 8;
          });
        }
      }
    });

    doc.save('Y360_Program_Booklet.pdf');
  };

  const getPageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cover: 'Cover Page',
      message: 'Message/Letter',
      facilitator: 'Facilitator Bio',
      agenda: 'Agenda',
      acknowledgements: 'Acknowledgements',
      thanks: 'Special Thanks',
      blank: 'Blank Page',
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tools"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Tools
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBook className="text-3xl text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Program Booklet Creator</h1>
              <p className="text-gray-600">Create professional event program booklets</p>
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <FaDownload />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pages ({pages.length})</h2>
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPage === page.id
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Page {page.pageNumber}</span>
                    <p className="font-medium text-gray-900 text-sm">
                      {page.title || getPageTypeLabel(page.type)}
                    </p>
                    <span className="text-xs text-indigo-600">{getPageTypeLabel(page.type)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-[80vh] overflow-y-auto">
          {selectedPage ? (
            (() => {
              const page = pages.find(p => p.id === selectedPage);
              if (!page) return null;
              
              return (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Edit Page {page.pageNumber}: {getPageTypeLabel(page.type)}
                  </h2>

                  {page.type !== 'blank' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={page.title || ''}
                          onChange={(e) => updatePage(page.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {(page.type === 'cover' || page.type === 'message' || page.type === 'facilitator' || page.type === 'thanks') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={page.subtitle || ''}
                            onChange={(e) => updatePage(page.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          value={page.content || ''}
                          onChange={(e) => updatePage(page.id, { content: e.target.value })}
                          rows={10}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      {page.type === 'message' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                              <input
                                type="text"
                                value={page.author || ''}
                                onChange={(e) => updatePage(page.id, { author: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Author Title</label>
                              <input
                                type="text"
                                value={page.authorTitle || ''}
                                onChange={(e) => updatePage(page.id, { authorTitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                            <input
                              type="text"
                              value={page.organization || ''}
                              onChange={(e) => updatePage(page.id, { organization: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </>
                      )}

                      {page.type === 'facilitator' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Session Overview</label>
                          <textarea
                            value={page.sessionOverview || ''}
                            onChange={(e) => updatePage(page.id, { sessionOverview: e.target.value })}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-center text-gray-500 py-20">
              <FaBook className="text-6xl mx-auto mb-4 text-gray-300" />
              <p>Select a page from the list to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Preview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`aspect-[8.5/11] bg-gray-100 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedPage === page.id ? 'border-indigo-500' : 'border-gray-200'
              }`}
            >
              <div className="p-2 h-full flex flex-col">
                <div className="text-[6px] text-gray-500 mb-1">Page {page.pageNumber}</div>
                {page.type === 'cover' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-4 bg-indigo-200 rounded mb-1"></div>
                    <div className="text-[5px] font-bold text-gray-700">{page.title}</div>
                  </div>
                )}
                {page.type === 'message' && (
                  <div className="flex-1">
                    <div className="text-[5px] font-bold text-gray-700 text-center mb-1">{page.title?.substring(0, 20)}</div>
                    <div className="space-y-0.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-0.5 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                  </div>
                )}
                {page.type === 'facilitator' && (
                  <div className="flex-1">
                    <div className="text-[5px] font-bold text-indigo-600 text-center mb-1">{page.subtitle?.substring(0, 15)}</div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto mb-1"></div>
                    <div className="space-y-0.5">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-0.5 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                  </div>
                )}
                {page.type === 'blank' && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[6px] text-gray-400">Blank</span>
                  </div>
                )}
                {(page.type === 'agenda' || page.type === 'acknowledgements' || page.type === 'thanks') && (
                  <div className="flex-1">
                    <div className="text-[5px] font-bold text-indigo-600 text-center mb-1">{page.title?.substring(0, 15)}</div>
                    <div className="space-y-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-0.5 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
