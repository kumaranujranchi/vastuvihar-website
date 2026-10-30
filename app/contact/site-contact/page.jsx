'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import styles from './site-contact.module.css';

// All site records are embedded here: no separate data import required.
// Copy page.jsx and site-contact.module.css into the SAME directory.

const SITE_CONTACT_DATA = [
  { state: "Bihar", branches: [
    { city: "Ara", phases: [
      { phase_name: "Ara PH-01", address: "Tetariya mor, Piania Road, Dakshini Akauna, Ara", phone: "8102921821, 7488049821" },
      { phase_name: "Ara PH-02", address: "Patna Road, Kayamnagar Bridge, 100 Mtr. In Birampur Road", phone: "8102921821, 7488049821" },
      { phase_name: "Ara PH-03", address: "Patna Road, Kayamnagar Bridge, 100 Mtr. In Birampur Road", phone: "8102921821, 7488049821" }
    ]},
    { city: "Aurangabad", phases: [
      { phase_name: "Aurangabad PH-01", address: "Dalten Ganj Road, Bijauli Behind D.A.V Public School Aurangabad", phone: "7488041827, 9386256119" },
      { phase_name: "Aurangabad PH-02", address: "Patna Road, Behind Indo Public School, Aurangabad", phone: "7488041827, 9386256119" },
      { phase_name: "Aurangabad PH-03", address: "Patna Road, Behind Indo Public School, Aurangabad", phone: "7488041827, 9386256119" }
    ]},
    { city: "Begusarai", phases: [
      { phase_name: "Begusarai PH-01", address: "Birpur Road, Pachamba, Chanwara block road, Begusarai", phone: "7488048703, 7488048704" },
      { phase_name: "Begusarai PH-02", address: "Tilarth, PO-Tilarth, PS-Barauni, Distt Begusarai-851122", phone: "7488048703, 7488048704" }
    ]},
    { city: "Bettiah", phases: [
      { phase_name: "Bettiah PH-01", address: "Areraj Road, Near -Saraswati Vidya Mandir School Barwatsena Bettiah", phone: "9386256109" },
      { phase_name: "Bettiah PH-02", address: "Areraj Road, Kathaiya Chowk, Bettiah 845438", phone: "6299202964" }
    ]},
    { city: "Bhagalpur", phases: [
      { phase_name: "Bhagalpur PH-01", address: "Pista Chowk, Dumka-Bounsi Road, Near Shiv Mandir, Bhagalpur", phone: "7488535249, 7488538169" },
      { phase_name: "Bhagalpur PH-02", address: "Gonu Dham Opp Chauhan Public School, Near Totta Pool, Dumka Bounsi Road, Bhagalpur", phone: "7488535249, 7488538169" },
      { phase_name: "Bhagalpur PH-03", address: "Vastu Vihar Near Chotki, Maksashpur, Bhagalpur Bihar 812005", phone: "7488535249, 7488538169" }
    ]},
    { city: "Bihar Sharif", phases: [
      { phase_name: "Bihar Sharif PH-01", address: "Korai Road, Deep Nagar, Nalanda, Bihar Sharif 803111", phone: "8102921825" },
      { phase_name: "Bihar Sharif PH-02", address: "Gulab Bigha Near Nalanda Police Station, Mohanpur, Bihar Sharif 803111", phone: "8102921825" },
      { phase_name: "Bihar Sharif PH-03", address: "Fatehpur, Bihar Sharif - Rajgir Rd, near Mahavihar Fuel Station, Panhessa, Bihar 803111", phone: "8102921825" }
    ]},
    { city: "Buxar", phases: [
      { phase_name: "Buxar PH-01", address: "Hukha Lalganj Etarhi Road, Buxar", phone: "8102921842" },
      { phase_name: "Buxar PH-02", address: "Hukha Etarhi Road, Buxar-802103", phone: "8102921842" },
      { phase_name: "Buxar PH-03", address: "Harikishunpur, Patna Buxar Highway", phone: "8102921842" }
    ]},
    { city: "Darbhanga", phases: [
      { phase_name: "Darbhanga PH-01", address: "NH-57 Towards Muzaffarpur near Hira petrol pump & Reliance petrol pump at Shahpur Chakka Chowk, Darbhanga", phone: "7488535211, 7488538162, 8102921835" },
      { phase_name: "Darbhanga PH-02", address: "NH-105 Towards Jay Nagar Madhubani Highway at Koyla Asthan, Darbhanga", phone: "7488538162, 7488047033" },
      { phase_name: "Darbhanga PH-03", address: "Sonki Road, Rampur Chowk, Dhoi Ghat, Darbhanga", phone: "7488538162, 7488047033" }
    ]},
    { city: "Dehri-on-Sone", phases: [
      { phase_name: "Dehri-on-Sone PH-01", address: "Tilouthu Road, Near Sad Dev Jib Aashram Katar, Dehri-On-Sone", phone: "9386256112, 9386256113" },
      { phase_name: "Dehri-on-Sone PH-02", address: "Tilouthu Banjari Road, Katar Badiha, Dehri-On-Sone", phone: "9386256112, 9386256113" }
    ]},
    { city: "Gaya", phases: [
      { phase_name: "Gaya PH-02", address: "Gaya Dobhi Road Near Pareena Motors & D.A.V Cantt. Gaya", phone: "7488535291, 8102921823" },
      { phase_name: "Gaya PH-03", address: "Front of D.A.V School, Gaya Wajirgunj Road, Manpur, Gaya", phone: "7488535291, 7488047028" },
      { phase_name: "Gaya PH-04", address: "Gaya Dobhi Road Near Maharani Petrol Pump, Gaya", phone: "7488535291, 7280023032" },
      { phase_name: "Gaya PH-05", address: "Gaya Dobhi Road Near Maharani Petrol Pump, Behind D.V.C colony, Gaya", phone: "7488535291, 7360006439" },
      { phase_name: "Gaya PH-07", address: "Gaya Dobhi road In front of Shree Ravi Shankar Ashram Shekhwara, Gaya", phone: "7488535291, 8102921823" },
      { phase_name: "Gaya PH-08", address: "Bindas more near Magadh dairy paimer station road - 823003", phone: "7488535291, 8102921823" },
      { phase_name: "Gaya PH-10", address: "Gaya Dobhi road In front of Shree Ravi Shankar Ashram Shekhwara, Gaya", phone: "7488535291, 8102921823" }
    ]},
    { city: "Hajipur", phases: [
      { phase_name: "Hajipur PH-01", address: "Paswan Chowk Jandaha Road Near Cipet College", phone: "8102921819, 7488538151", email: "hajipur@vastuvihar.org" },
      { phase_name: "Hajipur PH-02", address: "Paswan Chowk Jandaha Road Near Jaiprakash Evening College", phone: "8102921819, 7488538151", email: "hajipur@vastuvihar.org" },
      { phase_name: "Hajipur PH-03", address: "Jandaha Road Hilalpur Chowk Near Paswan Chowk 844101", phone: "8102921819, 7488538151" },
      { phase_name: "Hajipur PH-05", address: "J. P. Evening Inter College, Near Vastu Vihar Phase-II, Industrial Area, Jandaha Road", phone: "8102921819, 7488538151", email: "hajipur@vastuvihar.org" },
      { phase_name: "Hajipur PH-06", address: "Cipet College, Near Vastu Vihar Phase-I, Beside Subhai Railway Crossing, Industrial Area, Jandaha Road", phone: "8102921819, 7488538151", email: "hajipur@vastuvihar.org" }
    ]},
    { city: "Jehanabad", phases: [{ phase_name: "Jehanabad PH-01", address: "Ainwan Jehanabad-Patna Road Near Piaggio Showroom Jehanabad, Bihar 804408", phone: "7488538179, 7488538120" }]},
    { city: "Katihar", phases: [{ phase_name: "Katihar PH-01", address: "Near Sirsa Military Camp, Medical College Katihar", phone: "9386256102, 7280023043" }]},
    { city: "Motihari", phases: [
      { phase_name: "Motihari PH-01", address: "Malkainia Near Kunwari Devi Chowk Lakhaura Motihari", phone: "7488528332, 7488048393" },
      { phase_name: "Motihari PH-02", address: "NH-2 Muzaffarpur Road Bairiya Devi Mandir Near Reliance Petrol Pump", phone: "7280023005, 7488528332" },
      { phase_name: "Motihari PH-03", address: "Jodhara Market, Near Kishunpur Rly Gumti, Motihari, Bihar 845429", phone: "7280023005, 7488528332" }
    ]},
    { city: "Muzaffarpur", phases: [
      { phase_name: "Muzaffarpur PH-01", address: "Pakri chowk, Near Patai Road airport Bhagwanpur Chowk, Muzaffarpur", phone: "6205971595, 9334522266" },
      { phase_name: "Muzaffarpur PH-02", address: "Ladaura Near Gobarshahi Road, Bankapur, Muzaffarpur", phone: "7360006475, 9334522266" },
      { phase_name: "Muzaffarpur PH-03", address: "Dighra Rampur Shah, Muzaffarpur, Bihar 843126", phone: "7360006475, 9334522266" }
    ]},
    { city: "Munger", phases: [{ phase_name: "Munger PH-01", address: "Safiyabad Chowk, Near Tata Motors Chandrapura, Morcha Jamalpur - Munger 811214", phone: "7488538169, 9386256130" }]},
    { city: "Patna", phases: [
      { phase_name: "Patna PH-03", address: "Mathiyapur, Opposite Omega Mission School, Danapur-Shivala Road, Saguna More, Patna", phone: "7488538119, 8102926293" },
      { phase_name: "Patna PH-04", address: "Ashopur, Near Behind D.A.V. Saguna More, Patna", phone: "7488538119, 8102926293/4" },
      { phase_name: "Patna PH-06", address: "Naharpura, Near Baggha Tola, Patna AIIMS – Naubatpur Road, NH-98, Patna", phone: "7488538119, 8102926293/4" },
      { phase_name: "Patna PH-07", address: "Bhusaula, Near D.G.P. House, Patna AIIMS – Naubatpur Road, NH-98, Patna", phone: "7488538119, 8102926293/4" },
      { phase_name: "Patna PH-08", address: "Bela, Patna - Bihta Road, Near Shivala Chowk, Patna", phone: "7488538119, 8102926293/4" }
    ]},
    { city: "Purnia", phases: [
      { phase_name: "Purnia PH-01", address: "Banbhag Chowk, Jhandaha Road, Purnea", phone: "7488535250, 7280023057" },
      { phase_name: "Purnia PH-02", address: "Vastu Vihar Gulabbagh Gunda Chowk Near Ridhi Sidhi Petrol Pump, Purnea-854326", phone: "7488535250, 7280023057" }
    ]},
    { city: "Sasaram", phases: [
      { phase_name: "Sasaram PH-01", address: "Lal ganj Tetri Sasaram", phone: "7488047021, 8102921845" },
      { phase_name: "Sasaram PH-03", address: "Kumuhu Near Toll Tax PIN-821115", phone: "7488047021, 8102921845" }
    ]},
    { city: "Samastipur", phases: [{ phase_name: "Samastipur PH-01", address: "Vastu Vihar, Harpur Ailoth Musri Ghrari, Samastipur, Bihar 848101", phone: "9386256139, 8102921860" }]},
    { city: "Saharsa", phases: [
      { phase_name: "Saharsa PH-01", address: "Baidhynathpur Patuaha, beside Tata Motors, Saharsa, Bihar 852221", phone: "7280023040" },
      { phase_name: "Saharsa PH-02", address: "Near Shree Narayan Medical College, Yadav Chowk, Bheddhadi Road, Patuaha, Saharsa, Bihar 852221", phone: "7280023040, 7209559434" }
    ]},
    { city: "Siwan", phases: [{ phase_name: "Siwan PH-01", address: "Suta Mill Factory, Near by FCI Godown, Mairva Road Siwan", phone: "9546670033" }]},
    { city: "Chhapra", phases: [
      { phase_name: "Chhapra PH-01", address: "Chapra Muncipal Chowk, Railway track, Near Bintoli behind four lane toward south, Chhapra", phone: "7488535202, 8102921832" },
      { phase_name: "Chhapra PH-02", address: "MaujaBrahmpur, Near for Lane, Chhapra", phone: "7488535202, 8102921832" },
      { phase_name: "Chhapra PH-03", address: "Mauja Jamuna, Naini chanchaura road, Chapra", phone: "7488535202, 8102921832", email: "chapra@vastuvihar.org" }
    ]}
  ]},
  { state: "Jharkhand", branches: [
    { city: "Bokaro", phases: [
      { phase_name: "Bokaro PH-02", address: "Chira Chas, Bokaro-827013", phone: "7488538181,7488538184" },
      { phase_name: "Bokaro PH-04", address: "Chira Chas, Near Moti Lal Agarwal factory, Bokaro-827013", phone: "9905766902,7488538181/84" },
      { phase_name: "Bokaro PH-05", address: "Behind- Satanpur Mountain Baghrabera Beside Police Line, Bokaro-827012", phone: "7488538181,7488538184" },
      { phase_name: "Bokaro PH-06", address: "Chira Chas Near K.K. Singh Colony, Bokaro-827013", phone: "9835683538,7488538181/84" },
      { phase_name: "Bokaro PH-07", address: "Rajendra Nagar Bari Co-Operative Near Tetuliya Basti - 827012", phone: "7488535213,7488538181/84" },
      { phase_name: "Bokaro PH-08", address: "Ramdih More Sector-9 Near Officer Colony - 827009", phone: "7488535274,7488538181/84" }
    ]},
    { city: "Deoghar", phases: [
      { phase_name: "Deoghar PH-01", address: "Vastu Vihar Colony Deoghar Sultanganj Road Kusmaha Near Paritran Medical College Deoghar", phone: "6203212688 / 89" },
      { phase_name: "Deoghar PH-02", address: "Bilasi More, Punsia, Rampur, Mohanpur Deoghar Jharkhand", phone: "6203212688 / 89" }
    ]},
    { city: "Dhanbad", phases: [
      { phase_name: "Dhanbad PH-01", address: "Kolakusma, Near Balajee Petrol Pump, Baliapur Byepass Road, Dhanbad", phone: "7488333026, 7488535265" },
      { phase_name: "Dhanbad PH-02", address: "Jialgara, Govindpur Uttrayan GT Road NH2, Dhanbad, Jharkhand 828109", phone: "9304434579, 7488535265" },
      { phase_name: "Dhanbad Mountain View", address: "Mountain View Kolakusma, Near Balajee Petrol Pump, Baliapur Byepass Road, Dhanbad", phone: "7488333026, 7488535265" }
    ]},
    { city: "Giridih", phases: [{ phase_name: "Giridih PH-01", address: "Sonbhad, Near Bharat Petrol Pump, Giridih", phone: "6205510322, 7667449729" }]},
    { city: "Hazaribagh", phases: [
      { phase_name: "Hazaribagh PH-01", address: "Patna To Ranchi Highway, Mukundganj Chowk, Hazaribagh", phone: "7280023013" },
      { phase_name: "Hazaribagh PH-02", address: "Vastu Vihar Hazaribagh Babhanbai, Jharkhand 825302", phone: "7280023013" }
    ]},
    { city: "Jamshedpur", phases: [
      { phase_name: "Jamshedpur PH-05", address: "Near transport Nagar, Road No.-28, Adityapur, Saraikela Kharsawan", contacts: [{ name: "Vivek Kumar", role: "Site Supervisor", phone: "7488535260" }, { name: "Prabhat Sinha", role: "Project Manager", phone: "7488535221" }] },
      { phase_name: "Jamshedpur PH-06", address: "Asangi, Near NIIT Adityapur, Saraikela Kharsawan", contacts: [{ name: "Suraj Kumar Nishad", role: "Site Engg.", phone: "7488538137" }, { name: "Arvind Paswan", role: "Supervisor", phone: "7488535278" }, { name: "Prabhat Sinha", role: "Project Manager", phone: "7488535221" }] }
    ]},
    { city: "Ranchi", phases: [
      { phase_name: "Ranchi PH-01", address: "Bit Mesra Near Navodaya vidyalaya, Ranchi", phone: "7280023038/39" },
      { phase_name: "Ranchi PH-02", address: "Vill- Vastu Vihar Hardag P.O Huluhundu P.S Tipudana, Ranchi", phone: "7280023038/39" },
      { phase_name: "Ranchi PH-03", address: "BIT more behind Manrakhan B.ed college Kedal, Ranchi", phone: "7280023038/39" },
      { phase_name: "Ranchi PH-04", address: "Bukru Bazar, Kanke, Ranchi-Pithoriya Road, Ranchi 834006", phone: "7280023038/39" },
      { phase_name: "Ranchi PH-05", address: "Bukru Bazar, Kanke, Ranchi-Pithoriya Road, Ranchi 834006", phone: "7280023038/39" }
    ]}
  ]},
  { state: "West Bengal", branches: [
    { city: "Alipurduar", phases: [{ phase_name: "Alipurduar PH-01", address: "Bairaguri Banchukamari Gram Panchayat Near Ujjal Diller's Rashon Shop 2 KM away from Beltola Gas Godown Towards Highway, Alipurduar", phone: "8170028993, 8170028994" }]},
    { city: "Asansol", phases: [{ phase_name: "Asansol PH-01", address: "Gauri (Mouza) PO Kanyapur PS Asansol (N) Ward No.31 Burdman Near Asansol Engineering College NH-2, Asansol", phone: "7797701012, 7797701012" }]},
    { city: "Durgapur", phases: [{ phase_name: "Durgapur PH-01", address: "Behind Dr. B.C. Roy Engineering College, Haribazar, Durgapur", phone: "7797701014" }]},
    { city: "Kolkata", phases: [{ phase_name: "Kolkata PH-01", address: "Vastu Vihar Near Bhojerhat Bridge, At-Krolbaria, PO-Beonta-1, PS-Kolkata Lether Complex, Behind New Town, South 24 Pargana 743502", phone: "7070923666, 8100915974" }]},
    { city: "Siliguri", phases: [{ phase_name: "Siliguri PH-01", address: "Siliguri Khaprail Mirik Road, Near Matigara, Siliguri", phone: "7280023001, 8100193607" }]}
  ]},
  { state: "Uttar Pradesh", branches: [
    { city: "Gorakhpur", phases: [{ phase_name: "Gorakhpur PH-01", address: "Siktaur Near Sahara Estate, Deoria Baipass road, Gorakhpur UP-273008", phone: "7903611173, 9369997218" }]},
    { city: "Mirzapur", phases: [{ phase_name: "Mirzapur PH-01", address: "Vastu Vihar Near Atal Chowk, Sagra Vindhyachal Dham, Mirzapur Allahabad Highway Pin-231307", phone: "9369997221" }]},
    { city: "Varanasi", phases: [
      { phase_name: "Varanasi PH-01", address: "Vastu Vihar, Gopalapur, Jivnathpur road, Near ram nagar tengra more, PO basant nagar (UP) pin -221110", phone: "7280023050" },
      { phase_name: "Varanasi PH-02", address: "Vastu Vihar, Behind BHEL, Babatpur, Varanasi", phone: "6200187503" }
    ]}
  ]},
  { state: "Odisha", branches: [
    { city: "Bhubaneshwar", phases: [{ phase_name: "Bhubaneshwar PH-01", address: "Mouza-Gaonpada, Vill-Gaonpada, Grama panchayat-Orkala, Tahshil-Pipil, Dist-Puri", phone: "7070923666, 9337477771" }]},
    { city: "Rourkela", phases: [{ phase_name: "Rourkela PH-01", address: "Kuarmunda Road, Jamuna Naki, Behind Indian Oil Petrol Pump, Rourkela", phone: "7283007980, 6287798032" }]}
  ]}
];

const TOTAL_SITES = SITE_CONTACT_DATA.reduce(
  (total, state) => total + state.branches.reduce((sum, city) => sum + city.phases.length, 0),
  0
);

function Icon({ name, size = 18 }) {
  const attrs = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
    strokeLinejoin: 'round', 'aria-hidden': true,
  };
  if (name === 'search') return <svg {...attrs}><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>;
  if (name === 'chevron') return <svg {...attrs}><path d="m6 9 6 6 6-6"/></svg>;
  if (name === 'pin') return <svg {...attrs}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  if (name === 'phone') return <svg {...attrs}><path d="M22 16.6v2.7a2.2 2.2 0 0 1-2.4 2.2A20.2 20.2 0 0 1 2.5 4.4 2.2 2.2 0 0 1 4.7 2h2.7a2 2 0 0 1 2 1.7l.5 2.9a2 2 0 0 1-.6 1.9L8 9.8a16.6 16.6 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 1.9-.6l2.9.5a2 2 0 0 1 1.7 2.2Z"/></svg>;
  if (name === 'mail') return <svg {...attrs}><rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="m3 6 9 7 9-7"/></svg>;
  if (name === 'user') return <svg {...attrs}><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
  if (name === 'arrow') return <svg {...attrs}><path d="M7 17 17 7M8 7h9v9"/></svg>;
  if (name === 'x') return <svg {...attrs}><path d="M5 5 19 19M19 5 5 19"/></svg>;
  return null;
}

function Phones({ value }) {
  return (
    <div className={styles.phoneList}>
      {value.split(',').map((part, index) => {
        const display = part.trim();
        // A slash can abbreviate a second number, e.g. 8102926293/4.
        // Preserve the printed value and call ONLY the unambiguous first number.
        const match = display.match(/^(\d{10})(?:\s*\/.*)?$/);
        return match ? (
          <a key={`${display}-${index}`} href={`tel:+91${match[1]}`}>{display}</a>
        ) : (
          <span key={`${display}-${index}`}>{display}</span>
        );
      })}
    </div>
  );
}

function SiteCard({ site, city, state }) {
  const mapQuery = [site.address, city, state, 'India'].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardEyebrow}>Vastu Vihar project</span>
        <h4 className={styles.cardTitle}>{site.phase_name}</h4>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <span className={styles.detailIcon}><Icon name="pin"/></span>
          <p>{site.address}</p>
        </div>
        {site.phone && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="phone"/></span>
            <Phones value={site.phone}/>
          </div>
        )}
        {site.email && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="mail"/></span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        )}
        {site.contacts?.length > 0 && (
          <div className={styles.people}>
            {site.contacts.map((person, index) => (
              <div className={styles.person} key={`${person.name}-${index}`}>
                <span className={styles.detailIcon}><Icon name="user"/></span>
                <div>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                  {/^[0-9]{10}$/.test(person.phone)
                    ? <a href={`tel:+91${person.phone}`}>{person.phone}</a>
                    : <span>{person.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <a className={styles.mapLink} href={mapUrl} target="_blank" rel="noopener noreferrer">
        View location <Icon name="arrow" size={17}/>
      </a>
    </article>
  );
}

function Directory() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const cities = useMemo(() => {
    const matchingStates = SITE_CONTACT_DATA.filter((group) => !state || group.state === state);
    return [...new Set(matchingStates.flatMap((group) => group.branches.map((item) => item.city)))].sort();
  }, [state]);

  const groups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return SITE_CONTACT_DATA
      .filter((group) => !state || group.state === state)
      .map((group) => ({
        ...group,
        branches: group.branches
          .filter((branch) => !city || branch.city === city)
          .map((branch) => ({
            ...branch,
            phases: branch.phases.filter((site) => {
              if (!needle) return true;
              const text = [
                group.state, branch.city, site.phase_name, site.address,
                site.phone || '', site.email || '',
                ...(site.contacts || []).flatMap((person) => [person.name, person.role, person.phone]),
              ].join(' ').toLowerCase();
              return text.includes(needle);
            }),
          }))
          .filter((branch) => branch.phases.length > 0),
      }))
      .filter((group) => group.branches.length > 0);
  }, [search, state, city]);

  const results = groups.reduce((total, group) =>
    total + group.branches.reduce((sum, branch) => sum + branch.phases.length, 0), 0);
  const hasFilter = Boolean(search || state || city);
  const clearAll = () => { setSearch(''); setState(''); setCity(''); };

  return (
    <section className={styles.directory} aria-label="Search Vastu Vihar site contacts">
      {/* Search bar is the FIRST element — no introductory text above it. */}
      <div className={styles.filters} role="search" aria-label="Site contact filters">
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-query">Search sites</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><Icon name="search" size={19}/></span>
            <input id="site-contact-query" className={styles.input} type="search"
              placeholder="Search project, location or contact"
              value={search} onChange={(event) => setSearch(event.target.value)}/>
            {search && <button className={styles.clearInput} type="button" aria-label="Clear search" onClick={() => setSearch('')}><Icon name="x" size={16}/></button>}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-state">State</label>
          <div className={styles.inputWrap}>
            <select id="site-contact-state" className={styles.select} value={state}
              onChange={(event) => { setState(event.target.value); setCity(''); }}>
              <option value="">All states</option>
              {SITE_CONTACT_DATA.map((group) => <option key={group.state} value={group.state}>{group.state}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-city">City</label>
          <div className={styles.inputWrap}>
            <select id="site-contact-city" className={styles.select} value={city}
              onChange={(event) => setCity(event.target.value)}>
              <option value="">All cities</option>
              {cities.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
      </div>

      <div className={styles.resultsInfo} aria-live="polite">
        <p>Showing <strong>{results}</strong> of {TOTAL_SITES} sites</p>
        {hasFilter && <button type="button" className={styles.reset} onClick={clearAll}>Clear filters <Icon name="x" size={15}/></button>}
      </div>

      {groups.length > 0 ? (
        <div className={styles.results}>
          {groups.map((group) => (
            <section className={styles.stateSection} key={group.state} aria-label={group.state}>
              <div className={styles.stateHeading}>
                <h2>{group.state}</h2>
                <span>{group.branches.reduce((count, branch) => count + branch.phases.length, 0)} sites</span>
              </div>
              {group.branches.map((branch) => (
                <section className={styles.citySection} key={`${group.state}-${branch.city}`} aria-label={branch.city}>
                  <div className={styles.cityHeading}>
                    <h3>{branch.city}</h3>
                    <span>{branch.phases.length} {branch.phases.length === 1 ? 'project' : 'projects'}</span>
                  </div>
                  <div className={styles.cardGrid}>
                    {branch.phases.map((site, index) => (
                      <SiteCard key={`${site.phase_name}-${index}`} site={site} city={branch.city} state={group.state}/>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <Icon name="search" size={32}/>
          <h2>No matching sites found</h2>
          <p>Try another project name, city or state.</p>
          <button type="button" onClick={clearAll}>View all sites</button>
        </div>
      )}
    </section>
  );
}

export default function SiteContactPage() {
  return (
    <PageLayout route="contact">
      <Breadcrumb title="Site Contact"/>
      <div id="content" className={`site-content-page clear ${styles.page}`} tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              {/* Keep the original contact-page banner's global Elementor classes. */}
              <div data-elementor-type="wp-page" data-elementor-id="61" className="elementor elementor-61">
                <div className={`elementor-element elementor-element-dd4cc01 e-con-full e-flex e-con e-parent ${styles.banner}`}>
                  <div className={`elementor-element elementor-element-49de9ae e-flex e-con-boxed e-con e-child ${styles.bannerBox}`}>
                    <div className={`e-con-inner ${styles.bannerInner}`}>
                      <div className="elementor-element elementor-element-03bf66d elementor-widget elementor-widget-page-title">
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h1 className="elementor-heading-title elementor-size-default">Site Contact</h1>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-f99e958 e-con-full e-flex e-con e-child">
                        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                          <Link href="/" prefetch={false}>Home</Link>
                          <span aria-hidden="true">/</span>
                          <Link href="/contact" prefetch={false}>Contact</Link>
                          <span aria-hidden="true">/</span>
                          <span aria-current="page">Site Contact</span>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Directory/>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
