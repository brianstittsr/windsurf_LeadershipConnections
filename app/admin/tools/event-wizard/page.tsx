'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClipboardList, 
  FaDollarSign, 
  FaUserTie,
  FaVideo,
  FaCreditCard,
  FaChartBar,
  FaBlog,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaCheck,
  FaFileAlt,
  FaIdBadge,
  FaBook,
  FaImage,
  FaTasks,
  FaLink,
  FaDownload,
  FaClipboard,
  FaUserPlus
} from 'react-icons/fa';
import jsPDF from 'jspdf';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contact: string;
  notes: string;
}

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  facilitator: string;
  description: string;
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimated: number;
  actual: number;
  status: 'pending' | 'paid' | 'cancelled';
}

interface Presenter {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  sessionTitle: string;
  email: string;
  confirmed: boolean;
}

interface Registrant {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: 'youth' | 'adult' | 'volunteer' | 'presenter';
  group?: string;
  registered: boolean;
}

interface ProjectTask {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

interface ZoomMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  link: string;
  meetingId: string;
  passcode: string;
}

interface EventData {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  team: TeamMember[];
  venues: Venue[];
  activities: Activity[];
  budget: BudgetItem[];
  presenters: Presenter[];
  registrants: Registrant[];
  projectPlan: ProjectTask[];
  zoomMeetings: ZoomMeeting[];
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: FaCalendarAlt },
  { id: 'team', label: 'Team', icon: FaUsers },
  { id: 'venue', label: 'Venue', icon: FaMapMarkerAlt },
  { id: 'activities', label: 'Activities', icon: FaClipboardList },
  { id: 'budget', label: 'Budget', icon: FaDollarSign },
  { id: 'presenters', label: 'Presenters', icon: FaUserTie },
  { id: 'registration', label: 'Registration', icon: FaUserPlus },
  { id: 'project-plan', label: 'Project Plan', icon: FaTasks },
  { id: 'meetings', label: 'Meetings', icon: FaVideo },
  { id: 'artifacts', label: 'Artifacts', icon: FaDownload },
];

export default function EventWizardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [eventData, setEventData] = useState<EventData>({
    name: 'Y360 Technology and Trade Exploration Experience',
    date: '2025-12-06',
    startTime: '09:00',
    endTime: '14:00',
    description: 'A comprehensive program touching on AI & Robotics, skilled trades, family wellness and nutrition, with intergenerational learning opportunities.',
    team: [
      { id: '1', name: 'Katherine Harrelson', role: 'Founder/Volunteer Director', email: 'katherine@lcconnections.org', phone: '' },
      { id: '2', name: 'Veronica Revels', role: 'CEO/President', email: 'veronica@lcconnections.org', phone: '' },
    ],
    venues: [
      { id: '1', name: 'The Green Door', address: '130 Railroad Avenue, Gibsonville, NC', capacity: 100, contact: 'Gibsonville Square', notes: 'Building usage provided by Gibsonville Square' },
    ],
    activities: [
      { id: '1', name: 'Breakfast and Pre-Survey', startTime: '09:00', endTime: '09:50', location: 'Main Hall', facilitator: 'Staff', description: 'Welcome breakfast and participant surveys' },
      { id: '2', name: 'Session I', startTime: '10:00', endTime: '10:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'First rotation of workshops' },
      { id: '3', name: 'Session II', startTime: '11:00', endTime: '11:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'Second rotation of workshops' },
      { id: '4', name: 'Session III', startTime: '12:00', endTime: '12:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'Third rotation of workshops' },
      { id: '5', name: 'Closing', startTime: '13:00', endTime: '14:00', location: 'Main Hall', facilitator: 'Leadership Team', description: 'Closing remarks and certificates' },
    ],
    budget: [
      { id: '1', category: 'Venue', description: 'Building Usage', estimated: 0, actual: 0, status: 'paid' },
      { id: '2', category: 'Food', description: 'Breakfast and Snacks', estimated: 500, actual: 0, status: 'pending' },
      { id: '3', category: 'Materials', description: 'Workshop Supplies', estimated: 300, actual: 0, status: 'pending' },
      { id: '4', category: 'Equipment', description: 'Robotics Demo Equipment', estimated: 200, actual: 0, status: 'pending' },
    ],
    presenters: [
      { id: '1', name: 'Gloria Bass', title: 'Trades Exploration Facilitator', organization: '', bio: 'Dynamic professional in architecture and construction', sessionTitle: 'Trades Exploration', email: '', confirmed: true },
      { id: '2', name: 'Ty Gibson', title: 'Let\'s Move Ambassador', organization: 'Red Carpet Kids, USA', bio: 'Professional Actor and Clean Comedian', sessionTitle: 'Red Carpet Kids Health and Wellness', email: '', confirmed: true },
      { id: '3', name: 'Thea Monet', title: 'Peer Mentoring Facilitator', organization: 'WICK Enterprise', bio: 'Over five decades in health, education, and wellness', sessionTitle: 'Peer-to-Peer Mentoring Training', email: '', confirmed: true },
      { id: '4', name: 'Brian Stitt', title: 'Instructional Technologist', organization: 'Wake Technical Community College', bio: 'Automation Specialist and Adjunct Professor', sessionTitle: 'Technology Exploration (Robotics)', email: '', confirmed: true },
      { id: '5', name: 'Donald Sweeper', title: 'The Drone Whisperer', organization: 'SweepWorX', bio: 'Emerging Technology STEAM Education Alchemist', sessionTitle: 'Technology Exploration (Robotics)', email: '', confirmed: true },
      { id: '6', name: 'India Warner', title: 'Health and Wellness Facilitator', organization: '', bio: 'SERV Safe Certified Chef', sessionTitle: 'Red Carpet Kids Health and Wellness', email: '', confirmed: true },
    ],
    registrants: [
      { id: '1', name: 'Sample Youth 1', email: 'youth1@example.com', phone: '', organization: 'Local School', role: 'youth', group: 'Engineers (Blue)', registered: true },
      { id: '2', name: 'Sample Youth 2', email: 'youth2@example.com', phone: '', organization: 'Local School', role: 'youth', group: 'Architects (Green)', registered: true },
      { id: '3', name: 'Sample Adult 1', email: 'adult1@example.com', phone: '', organization: 'Community Center', role: 'adult', group: 'Contractors (Yellow)', registered: true },
    ],
    projectPlan: [
      { id: '1', task: 'Confirm venue booking', assignee: 'Katherine Harrelson', dueDate: '2025-11-01', status: 'completed', category: 'Venue' },
      { id: '2', task: 'Finalize presenter list', assignee: 'Veronica Revels', dueDate: '2025-11-15', status: 'completed', category: 'Presenters' },
      { id: '3', task: 'Order workshop materials', assignee: 'Team', dueDate: '2025-11-25', status: 'in-progress', category: 'Materials' },
      { id: '4', task: 'Send registration confirmations', assignee: 'Team', dueDate: '2025-12-01', status: 'pending', category: 'Registration' },
      { id: '5', task: 'Print program booklets', assignee: 'Team', dueDate: '2025-12-03', status: 'pending', category: 'Materials' },
      { id: '6', task: 'Print name badges', assignee: 'Team', dueDate: '2025-12-04', status: 'pending', category: 'Materials' },
      { id: '7', task: 'Setup venue', assignee: 'Volunteers', dueDate: '2025-12-05', status: 'pending', category: 'Venue' },
      { id: '8', task: 'Event day execution', assignee: 'All', dueDate: '2025-12-06', status: 'pending', category: 'Event' },
    ],
    zoomMeetings: [
      { id: '1', title: 'Planning Committee Meeting', date: '2025-11-20', time: '18:00', link: 'https://zoom.us/j/example1', meetingId: '123 456 7890', passcode: 'Y360' },
      { id: '2', title: 'Presenter Orientation', date: '2025-12-01', time: '19:00', link: 'https://zoom.us/j/example2', meetingId: '234 567 8901', passcode: 'Y360' },
      { id: '3', title: 'Volunteer Training', date: '2025-12-04', time: '18:00', link: 'https://zoom.us/j/example3', meetingId: '345 678 9012', passcode: 'Y360' },
    ],
  });

  const updateEventField = (field: keyof EventData, value: any) => {
    setEventData({ ...eventData, [field]: value });
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      email: '',
      phone: '',
    };
    updateEventField('team', [...eventData.team, newMember]);
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    updateEventField('team', eventData.team.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeTeamMember = (id: string) => {
    updateEventField('team', eventData.team.filter(m => m.id !== id));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: '',
      startTime: '',
      endTime: '',
      location: '',
      facilitator: '',
      description: '',
    };
    updateEventField('activities', [...eventData.activities, newActivity]);
  };

  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    updateEventField('activities', eventData.activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeActivity = (id: string) => {
    updateEventField('activities', eventData.activities.filter(a => a.id !== id));
  };

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category: '',
      description: '',
      estimated: 0,
      actual: 0,
      status: 'pending',
    };
    updateEventField('budget', [...eventData.budget, newItem]);
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    updateEventField('budget', eventData.budget.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBudgetItem = (id: string) => {
    updateEventField('budget', eventData.budget.filter(b => b.id !== id));
  };

  const addPresenter = () => {
    const newPresenter: Presenter = {
      id: Date.now().toString(),
      name: '',
      title: '',
      organization: '',
      bio: '',
      sessionTitle: '',
      email: '',
      confirmed: false,
    };
    updateEventField('presenters', [...eventData.presenters, newPresenter]);
  };

  const updatePresenter = (id: string, field: keyof Presenter, value: any) => {
    updateEventField('presenters', eventData.presenters.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePresenter = (id: string) => {
    updateEventField('presenters', eventData.presenters.filter(p => p.id !== id));
  };

  // Registrant functions
  const addRegistrant = () => {
    const newRegistrant: Registrant = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      organization: '',
      role: 'youth',
      group: '',
      registered: false,
    };
    updateEventField('registrants', [...eventData.registrants, newRegistrant]);
  };

  const updateRegistrant = (id: string, field: keyof Registrant, value: any) => {
    updateEventField('registrants', eventData.registrants.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRegistrant = (id: string) => {
    updateEventField('registrants', eventData.registrants.filter(r => r.id !== id));
  };

  // Project Plan functions
  const addTask = () => {
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      task: '',
      assignee: '',
      dueDate: '',
      status: 'pending',
      category: '',
    };
    updateEventField('projectPlan', [...eventData.projectPlan, newTask]);
  };

  const updateTask = (id: string, field: keyof ProjectTask, value: any) => {
    updateEventField('projectPlan', eventData.projectPlan.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    updateEventField('projectPlan', eventData.projectPlan.filter(t => t.id !== id));
  };

  // Zoom Meeting functions
  const addMeeting = () => {
    const newMeeting: ZoomMeeting = {
      id: Date.now().toString(),
      title: '',
      date: '',
      time: '',
      link: '',
      meetingId: '',
      passcode: '',
    };
    updateEventField('zoomMeetings', [...eventData.zoomMeetings, newMeeting]);
  };

  const updateMeeting = (id: string, field: keyof ZoomMeeting, value: string) => {
    updateEventField('zoomMeetings', eventData.zoomMeetings.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMeeting = (id: string) => {
    updateEventField('zoomMeetings', eventData.zoomMeetings.filter(m => m.id !== id));
  };

  // Logo state for PDF generation
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

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

  // Artifact Generation Functions
  const generateProgramBooklet = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = 215.9;
    const pageHeight = 279.4;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Cover Page
    let y = 30;
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', (pageWidth - 40) / 2, y, 40, 28);
      y += 38;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Leadership C.O.N.N.E.C.T.I.O.N.S.', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('PRESENTS', pageWidth / 2, y, { align: 'center' });
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(79, 70, 229);
    doc.text('Y360', pageWidth / 2, y, { align: 'center' });
    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Technology and Trade', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text('Exploration Experience', pageWidth / 2, y, { align: 'center' });
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const eventDate = new Date(eventData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(eventDate.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 8;
    if (eventData.venues[0]) {
      doc.text(`"${eventData.venues[0].name.toUpperCase()}"`, pageWidth / 2, y, { align: 'center' });
      y += 6;
      doc.text(eventData.venues[0].address.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    }
    y += 10;
    doc.text(`${eventData.startTime} - ${eventData.endTime}`, pageWidth / 2, y, { align: 'center' });

    // Photo placeholder page
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.text('Event Photos', pageWidth / 2, 30, { align: 'center' });
    // Draw placeholder boxes for photos
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = margin + col * (contentWidth / 2 + 5);
        const boxY = 50 + row * 90;
        doc.roundedRect(x, boxY, contentWidth / 2 - 5, 80, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Photo Placeholder', x + (contentWidth / 4) - 2.5, boxY + 40, { align: 'center' });
      }
    }

    // Facilitator pages
    eventData.presenters.forEach((presenter, index) => {
      doc.addPage();
      let py = margin + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text(presenter.sessionTitle || 'Session', pageWidth / 2, py, { align: 'center' });
      py += 10;
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(presenter.name, pageWidth / 2, py, { align: 'center' });
      py += 8;
      if (presenter.title) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(presenter.title, pageWidth / 2, py, { align: 'center' });
        py += 6;
      }
      if (presenter.organization) {
        doc.text(presenter.organization, pageWidth / 2, py, { align: 'center' });
        py += 10;
      }
      // Photo placeholder for presenter
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect((pageWidth - 50) / 2, py, 50, 50, 3, 3, 'FD');
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('Photo', pageWidth / 2, py + 27, { align: 'center' });
      py += 60;
      // Bio
      if (presenter.bio) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const bioLines = doc.splitTextToSize(presenter.bio, contentWidth);
        doc.text(bioLines, margin, py);
      }
      // Page number
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(String(index + 3), pageWidth / 2, pageHeight - 10, { align: 'center' });
    });

    // Agenda page
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text('Agenda', pageWidth / 2, 25, { align: 'center' });
    let ay = 40;
    doc.setFontSize(10);
    eventData.activities.sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach((activity) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`${activity.startTime} - ${activity.endTime}`, margin, ay);
      doc.text(activity.name, margin + 35, ay);
      ay += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Location: ${activity.location}`, margin + 35, ay);
      ay += 8;
    });

    doc.save(`${eventData.name.replace(/\s+/g, '_')}_Program_Booklet.pdf`);
  };

  const generateNameBadges = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = 215.9;
    const badgeWidth = 89;
    const badgeHeight = 59;
    const marginLeft = 19;
    const marginTop = 21;
    const cols = 2;
    const rows = 4;

    const allPeople = [
      ...eventData.registrants.map(r => ({ name: r.name, title: r.role, org: r.organization })),
      ...eventData.presenters.map(p => ({ name: p.name, title: 'Presenter', org: p.organization })),
      ...eventData.team.map(t => ({ name: t.name, title: t.role, org: 'Staff' })),
    ];

    let badgeIndex = 0;
    allPeople.forEach((person, i) => {
      if (badgeIndex > 0 && badgeIndex % (cols * rows) === 0) {
        doc.addPage();
      }
      const pageIndex = badgeIndex % (cols * rows);
      const col = pageIndex % cols;
      const row = Math.floor(pageIndex / cols);
      const x = marginLeft + col * badgeWidth;
      const y = marginTop + row * badgeHeight;

      // Badge outline
      doc.setDrawColor(220, 220, 220);
      doc.rect(x, y, badgeWidth, badgeHeight);

      // Logo
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', x + (badgeWidth - 20) / 2, y + 5, 20, 14);
      }

      // Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(person.name, x + badgeWidth / 2, y + 30, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(person.title.charAt(0).toUpperCase() + person.title.slice(1), x + badgeWidth / 2, y + 38, { align: 'center' });

      // Organization
      if (person.org) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(person.org, x + badgeWidth / 2, y + 45, { align: 'center' });
      }

      // Event name
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Y360 - Technology & Trade Exploration', x + badgeWidth / 2, y + 53, { align: 'center' });

      badgeIndex++;
    });

    doc.save(`${eventData.name.replace(/\s+/g, '_')}_Name_Badges.pdf`);
  };

  const generateRegistrationForm = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = 215.9;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Header
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, 15, 30, 21);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('Registration Form', pageWidth / 2, 25, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(eventData.name, pageWidth / 2, 33, { align: 'center' });

    let y = 55;
    const lineHeight = 12;
    const fieldWidth = contentWidth / 2 - 5;

    // Form fields
    const drawField = (label: string, x: number, width: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(label, x, y);
      doc.setDrawColor(200, 200, 200);
      doc.line(x, y + 5, x + width, y + 5);
    };

    drawField('First Name:', margin, fieldWidth);
    drawField('Last Name:', margin + fieldWidth + 10, fieldWidth);
    y += lineHeight + 5;

    drawField('Email:', margin, contentWidth);
    y += lineHeight + 5;

    drawField('Phone:', margin, fieldWidth);
    drawField('Date of Birth:', margin + fieldWidth + 10, fieldWidth);
    y += lineHeight + 5;

    drawField('Organization/School:', margin, contentWidth);
    y += lineHeight + 5;

    drawField('Address:', margin, contentWidth);
    y += lineHeight + 5;

    drawField('City:', margin, fieldWidth - 20);
    drawField('State:', margin + fieldWidth - 10, 30);
    drawField('ZIP:', margin + fieldWidth + 30, 40);
    y += lineHeight + 10;

    // Role selection
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Participant Type (check one):', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const roles = ['Youth (under 18)', 'Adult', 'Volunteer', 'Presenter'];
    roles.forEach((role, i) => {
      doc.rect(margin + (i * 45), y, 4, 4);
      doc.text(role, margin + 6 + (i * 45), y + 3.5);
    });
    y += 15;

    // Group selection
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Group Assignment (for youth):', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const groups = ['Engineers (Blue)', 'Architects (Green)', 'Contractors (Yellow)'];
    groups.forEach((group, i) => {
      doc.rect(margin + (i * 55), y, 4, 4);
      doc.text(group, margin + 6 + (i * 55), y + 3.5);
    });
    y += 20;

    // Emergency contact
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Emergency Contact Information', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    drawField('Contact Name:', margin, fieldWidth);
    drawField('Relationship:', margin + fieldWidth + 10, fieldWidth);
    y += lineHeight + 5;
    drawField('Contact Phone:', margin, fieldWidth);
    y += lineHeight + 15;

    // Signature
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('I agree to participate in this event and follow all safety guidelines.', margin, y);
    y += 15;
    drawField('Signature:', margin, fieldWidth);
    drawField('Date:', margin + fieldWidth + 10, fieldWidth);

    doc.save(`${eventData.name.replace(/\s+/g, '_')}_Registration_Form.pdf`);
  };

  const generateProjectPlan = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageWidth = 279.4;
    const pageHeight = 215.9;
    const margin = 15;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text(`${eventData.name} - Project Plan`, pageWidth / 2, 20, { align: 'center' });

    // Table headers
    let y = 35;
    const colWidths = [80, 50, 35, 35, 50];
    const headers = ['Task', 'Assignee', 'Due Date', 'Status', 'Category'];
    
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    
    let x = margin + 3;
    headers.forEach((header, i) => {
      doc.text(header, x, y + 7);
      x += colWidths[i];
    });
    y += 12;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    eventData.projectPlan.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).forEach((task, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 250);
        doc.rect(margin, y - 2, pageWidth - margin * 2, 10, 'F');
      }
      
      x = margin + 3;
      doc.text(task.task.substring(0, 40), x, y + 5);
      x += colWidths[0];
      doc.text(task.assignee, x, y + 5);
      x += colWidths[1];
      doc.text(task.dueDate, x, y + 5);
      x += colWidths[2];
      
      // Status with color
      const statusColors: Record<string, number[]> = {
        'completed': [34, 197, 94],
        'in-progress': [234, 179, 8],
        'pending': [156, 163, 175],
      };
      const color = statusColors[task.status] || [156, 163, 175];
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(task.status, x, y + 5);
      doc.setTextColor(60, 60, 60);
      x += colWidths[3];
      doc.text(task.category, x, y + 5);
      
      y += 10;
    });

    doc.save(`${eventData.name.replace(/\s+/g, '_')}_Project_Plan.pdf`);
  };

  const totalEstimated = eventData.budget.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = eventData.budget.reduce((sum, item) => sum + item.actual, 0);

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
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-3xl text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Planning Wizard</h1>
            <p className="text-gray-600">Comprehensive event planning and management</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Event Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventData.name}
                    onChange={(e) => updateEventField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => updateEventField('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => updateEventField('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => updateEventField('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => updateEventField('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{eventData.team.length}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{eventData.presenters.length}</div>
                  <div className="text-sm text-gray-600">Presenters</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{eventData.activities.length}</div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">${totalEstimated}</div>
                  <div className="text-sm text-gray-600">Est. Budget</div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <button
                  onClick={addTeamMember}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Member
                </button>
              </div>
              <div className="space-y-4">
                {eventData.team.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Role/Title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => updateTeamMember(member.id, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="(555) 555-5555"
                          />
                        </div>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Tab */}
          {activeTab === 'venue' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Venue Information</h2>
              {eventData.venues.map((venue) => (
                <div key={venue.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={venue.name}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, name: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        value={venue.capacity}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, capacity: parseInt(e.target.value) } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={venue.address}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, address: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                      <input
                        type="text"
                        value={venue.contact}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, contact: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={venue.notes}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, notes: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Schedule & Activities</h2>
                <button
                  onClick={addActivity}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Activity
                </button>
              </div>
              <div className="space-y-4">
                {eventData.activities.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Activity Name</label>
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={activity.startTime}
                          onChange={(e) => updateActivity(activity.id, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={activity.endTime}
                          onChange={(e) => updateActivity(activity.id, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                        <input
                          type="text"
                          value={activity.location}
                          onChange={(e) => updateActivity(activity.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeActivity(activity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={activity.description}
                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Budget Tracking</h2>
                <button
                  onClick={addBudgetItem}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              {/* Budget Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Estimated Total</div>
                  <div className="text-2xl font-bold text-blue-600">${totalEstimated.toFixed(2)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Actual Spent</div>
                  <div className="text-2xl font-bold text-green-600">${totalActual.toFixed(2)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Remaining</div>
                  <div className="text-2xl font-bold text-orange-600">${(totalEstimated - totalActual).toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-3">
                {eventData.budget.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateBudgetItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estimated</label>
                        <input
                          type="number"
                          value={item.estimated}
                          onChange={(e) => updateBudgetItem(item.id, 'estimated', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Actual</label>
                        <input
                          type="number"
                          value={item.actual}
                          onChange={(e) => updateBudgetItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => updateBudgetItem(item.id, 'status', e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                            item.status === 'paid' ? 'bg-green-100 border-green-300' :
                            item.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                            'bg-yellow-100 border-yellow-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => removeBudgetItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Presenters Tab */}
          {activeTab === 'presenters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Presenters & Facilitators</h2>
                <button
                  onClick={addPresenter}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Presenter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.presenters.map((presenter) => (
                  <div key={presenter.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${presenter.confirmed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs text-gray-500">{presenter.confirmed ? 'Confirmed' : 'Pending'}</span>
                      </div>
                      <button
                        onClick={() => removePresenter(presenter.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={presenter.name}
                          onChange={(e) => updatePresenter(presenter.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={presenter.title}
                            onChange={(e) => updatePresenter(presenter.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Organization</label>
                          <input
                            type="text"
                            value={presenter.organization}
                            onChange={(e) => updatePresenter(presenter.id, 'organization', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Session Title</label>
                        <input
                          type="text"
                          value={presenter.sessionTitle}
                          onChange={(e) => updatePresenter(presenter.id, 'sessionTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={presenter.confirmed}
                          onChange={(e) => updatePresenter(presenter.id, 'confirmed', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-600">Confirmed</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Tab */}
          {activeTab === 'registration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Registration ({eventData.registrants.length})</h2>
                <button
                  onClick={addRegistrant}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Registrant
                </button>
              </div>
              <div className="space-y-3">
                {eventData.registrants.map((registrant) => (
                  <div key={registrant.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={registrant.name}
                          onChange={(e) => updateRegistrant(registrant.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          value={registrant.email}
                          onChange={(e) => updateRegistrant(registrant.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                        <select
                          value={registrant.role}
                          onChange={(e) => updateRegistrant(registrant.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="youth">Youth</option>
                          <option value="adult">Adult</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="presenter">Presenter</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Group</label>
                        <select
                          value={registrant.group || ''}
                          onChange={(e) => updateRegistrant(registrant.id, 'group', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">Select Group</option>
                          <option value="Engineers (Blue)">Engineers (Blue)</option>
                          <option value="Architects (Green)">Architects (Green)</option>
                          <option value="Contractors (Yellow)">Contractors (Yellow)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={registrant.registered}
                          onChange={(e) => updateRegistrant(registrant.id, 'registered', e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <label className="text-sm text-gray-600">Confirmed</label>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeRegistrant(registrant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Plan Tab */}
          {activeTab === 'project-plan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Project Plan</h2>
                <button
                  onClick={addTask}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Task
                </button>
              </div>
              <div className="space-y-3">
                {eventData.projectPlan.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((task) => (
                  <div key={task.id} className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                    task.status === 'completed' ? 'border-green-500' :
                    task.status === 'in-progress' ? 'border-yellow-500' : 'border-gray-300'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Task</label>
                        <input
                          type="text"
                          value={task.task}
                          onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Assignee</label>
                        <input
                          type="text"
                          value={task.assignee}
                          onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => updateTask(task.id, 'dueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, 'status', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg text-sm ${
                            task.status === 'completed' ? 'bg-green-100 border-green-300' :
                            task.status === 'in-progress' ? 'bg-yellow-100 border-yellow-300' :
                            'bg-gray-100 border-gray-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meetings Tab */}
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Zoom Meetings</h2>
                <button
                  onClick={addMeeting}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Meeting
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.zoomMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <FaVideo className="text-blue-600 text-xl" />
                      <button
                        onClick={() => removeMeeting(meeting.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Meeting Title</label>
                        <input
                          type="text"
                          value={meeting.title}
                          onChange={(e) => updateMeeting(meeting.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                          <input
                            type="date"
                            value={meeting.date}
                            onChange={(e) => updateMeeting(meeting.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                          <input
                            type="time"
                            value={meeting.time}
                            onChange={(e) => updateMeeting(meeting.id, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Zoom Link</label>
                        <input
                          type="url"
                          value={meeting.link}
                          onChange={(e) => updateMeeting(meeting.id, 'link', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="https://zoom.us/j/..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Meeting ID</label>
                          <input
                            type="text"
                            value={meeting.meetingId}
                            onChange={(e) => updateMeeting(meeting.id, 'meetingId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Passcode</label>
                          <input
                            type="text"
                            value={meeting.passcode}
                            onChange={(e) => updateMeeting(meeting.id, 'passcode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      {meeting.link && (
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                        >
                          <FaLink /> Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artifacts Tab */}
          {activeTab === 'artifacts' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Generate Event Artifacts</h2>
              <p className="text-gray-600">Generate and download all the materials you need for your event.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Program Booklet */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <FaBook className="text-2xl text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Program Booklet</h3>
                      <p className="text-sm text-gray-600">Multi-page event program</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-1">
                    <li>• Cover page with event details</li>
                    <li>• Photo placeholder pages</li>
                    <li>• Facilitator bios with photos</li>
                    <li>• Event agenda</li>
                  </ul>
                  <button
                    onClick={generateProgramBooklet}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaDownload /> Generate Booklet
                  </button>
                </div>

                {/* Name Badges */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FaIdBadge className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Name Badges</h3>
                      <p className="text-sm text-gray-600">Avery 5395 format</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-1">
                    <li>• {eventData.registrants.length} registrants</li>
                    <li>• {eventData.presenters.length} presenters</li>
                    <li>• {eventData.team.length} team members</li>
                    <li>• 8 badges per page</li>
                  </ul>
                  <button
                    onClick={generateNameBadges}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaDownload /> Generate Badges
                  </button>
                </div>

                {/* Registration Form */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaClipboard className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Registration Form</h3>
                      <p className="text-sm text-gray-600">Printable sign-up form</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-1">
                    <li>• Contact information fields</li>
                    <li>• Participant type selection</li>
                    <li>• Group assignment</li>
                    <li>• Emergency contact</li>
                  </ul>
                  <button
                    onClick={generateRegistrationForm}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaDownload /> Generate Form
                  </button>
                </div>

                {/* Project Plan */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FaTasks className="text-2xl text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Project Plan</h3>
                      <p className="text-sm text-gray-600">Task list with deadlines</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4 space-y-1">
                    <li>• {eventData.projectPlan.length} tasks</li>
                    <li>• {eventData.projectPlan.filter(t => t.status === 'completed').length} completed</li>
                    <li>• {eventData.projectPlan.filter(t => t.status === 'in-progress').length} in progress</li>
                    <li>• {eventData.projectPlan.filter(t => t.status === 'pending').length} pending</li>
                  </ul>
                  <button
                    onClick={generateProjectPlan}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <FaDownload /> Generate Plan
                  </button>
                </div>

                {/* Zoom Meeting Links */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FaVideo className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Meeting Links</h3>
                      <p className="text-sm text-gray-600">Zoom meeting details</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 space-y-2">
                    {eventData.zoomMeetings.slice(0, 3).map((meeting) => (
                      <div key={meeting.id} className="flex items-center gap-2">
                        <FaLink className="text-purple-500" />
                        <span className="truncate">{meeting.title}</span>
                      </div>
                    ))}
                    {eventData.zoomMeetings.length > 3 && (
                      <p className="text-purple-600">+{eventData.zoomMeetings.length - 3} more</p>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('meetings')}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FaLink /> View All Meetings
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FaChartBar className="text-2xl text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Event Summary</h3>
                      <p className="text-sm text-gray-600">Quick overview</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-blue-600">{eventData.registrants.length}</div>
                      <div className="text-gray-500">Registrants</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-green-600">{eventData.presenters.length}</div>
                      <div className="text-gray-500">Presenters</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-purple-600">{eventData.activities.length}</div>
                      <div className="text-gray-500">Activities</div>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-xl font-bold text-orange-600">${totalEstimated}</div>
                      <div className="text-gray-500">Budget</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
