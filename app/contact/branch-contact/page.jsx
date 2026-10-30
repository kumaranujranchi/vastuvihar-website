'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import styles from './branch-contact.module.css';

// Complete branch list embedded from the supplied Vastu Vihar contact details.
// This page only needs branch-contact.module.css next to page.jsx.
const BRANCH_GROUPS = [
  {
    "state": "Bihar",
    "branches": [
      {
        "name": "Ara",
        "address": "1st Floor, Mahuli Tower, K.G Road Ara-802301",
        "email": "ara@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Manoranjan Jha (Project Manager)",
            "phones": [
              "7488049821"
            ]
          },
          {
            "name": "Shivangi Singh (Marketing)",
            "phones": [
              "7392984090"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115181.69342743699!2d84.59039366525357!3d25.55742633826834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398d5f64fae61e8d%3A0xca9ea74597bd19f9!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1669531092291!5m2!1sen!2sin"
      },
      {
        "name": "Aurangabad",
        "address": "MG Road, 3rd Floor Kasa Complex, Infront Of Khana Sweets Opp HP Petrol Pump, Aurangabad-824101",
        "email": "aurangabad@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Ajay Rai (Project Manager)",
            "phones": [
              "7488538164"
            ]
          },
          {
            "name": "Abhinav Kumar (Marketing)",
            "phones": [
              "9386256118"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.358996604388!2d84.364188!3d24.7488775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398cfd4c2c8c908d%3A0xec2c5247c72527e0!2sVastu%20Vihar%20Aurangabad%20Office!5e0!3m2!1sen!2sin!4v1670045214868!5m2!1sen!2sin"
      },
      {
        "name": "Begusarai",
        "address": "1st Floor J.K. Place, Near Kapasia Chowk, NH-31, Begusarai-851117",
        "email": "begusarai@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Vivek Kumar (General Manager)",
            "phones": [
              "8102921827"
            ]
          },
          {
            "name": "Sunil Yadav (Project Manager)",
            "phones": [
              "7488048703"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d115311.64128664711!2d86.0439002!3d25.4219172!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f21ab5544c9845%3A0x2516f44f5171748d!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670046503471!5m2!1sen!2sin"
      },
      {
        "name": "Bettiah",
        "address": "Areraj Road, Near -Saraswati Vidya Mandir School Barwatsena Bettiah",
        "email": "bettiah@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Akash Chaubey (Project Manager)",
            "phones": [
              "7033038999"
            ]
          },
          {
            "name": "Mursid Alam (Site Engg.)",
            "phones": [
              "8789460783"
            ]
          },
          {
            "name": "Ankit Kumar (Marketing)",
            "phones": [
              "7320885222"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14248.25042769078!2d84.53680070046383!3d26.774274190395296!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xbb05007404b643f9!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670048375388!5m2!1sen!2sin"
      },
      {
        "name": "Bhagalpur",
        "address": "Bose Park,MG Road Behind Bhagalpur X-Ray & Bhawna Hotel,Bhagalpur-812001",
        "email": "bhagalpur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Md. Perwez Khan (Project Manager)",
            "phones": [
              "7033173111"
            ]
          },
          {
            "name": "Abhishek Pandey (Marketing)",
            "phones": [
              "6287895079"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.592909182553!2d86.9874876!3d25.2506329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04a03ccee8ca5%3A0x4fe28d9450aa5234!2sVastu%20Vihar%20(Office%20Bhagalpur)!5e0!3m2!1sen!2sin!4v1670048480367!5m2!1sen!2sin"
      },
      {
        "name": "Bihar Sharif",
        "address": "Jagdish Place Biharsharif-Rajgir Road Beside Vegetable Market Deepnagar, Bihar Sharif 803111",
        "email": "biharsharif@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Sabbir Khan (Project Manager)",
            "phones": [
              "7488538178"
            ]
          },
          {
            "name": "Prince Jha (Marketing)",
            "phones": [
              "9031863050"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d115589.82650945727!2d85.3914847!3d25.1295344!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2f223108d30fd%3A0xa390477e26f0df93!2sVastu%20Vihar%20Bihar%20Sharif%20Phase%202!5e0!3m2!1sen!2sin!4v1670048550941!5m2!1sen!2sin"
      },
      {
        "name": "Buxar",
        "address": "Hukha Lalganj Etarhi Road, Buxar-802101",
        "email": "buxar@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Nayeemul Haque (Project Manager)",
            "phones": [
              "8102921842"
            ]
          },
          {
            "name": "Vishwanath Singh (Marketing)",
            "phones": [
              "7972306499"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d115199.58240861291!2d83.9194842!3d25.5388116!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398d8bece22579fb%3A0xbcfc6335079f571e!2sVastu%20Vihar%20Buxar%20Phase%201!5e0!3m2!1sen!2sin!4v1670048855699!5m2!1sen!2sin"
      },
      {
        "name": "Darbhanga",
        "address": "Gayatri Complex 2nd floor Vastu Vihar, Near IOC Petrol Pump, Bela More, Darbhanga-846004",
        "email": "darbhanga@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Jitendra Tiwari (Project Manager)",
            "phones": [
              "9031629544"
            ]
          },
          {
            "name": "Ashutosh Kumar (Marketing)",
            "phones": [
              "8102921835"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d57296.94179744405!2d85.8645461!3d26.1622124!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb826e889d80d%3A0xfc905a7c000de4c4!2sVastu%20Vihar%20-%20Darbhanga%20Branch!5e0!3m2!1sen!2sin!4v1670048936929!5m2!1sen!2sin"
      },
      {
        "name": "Dehri-on-Sone",
        "address": "Sahara Complex, Near Vandana Hotel, Pali Road, Dehri on sone-821307",
        "email": "dehrionsone@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Ashutosh Rai (Project Manager)",
            "phones": [
              "7488879233",
              "7781037960"
            ]
          },
          {
            "name": "Rajeev Kumar (Marketing)",
            "phones": [
              "9386256112"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d927804.8511066221!2d84.0375785!3d24.7187185!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398da94cd46e705d%3A0x726008cfa0bbb278!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670049038021!5m2!1sen!2sin"
      },
      {
        "name": "Gaya",
        "address": "Gitanjali Bhawan, 1st Floor Besides SBI Life Insurance Asha Singh More, A.P.Colony Gaya-823001",
        "email": "gaya@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Sabyasachi Pramanik (Assistant Project Manager)",
            "phones": [
              "8102921823"
            ]
          },
          {
            "name": "Aniket Pathak (Marketing)",
            "phones": [
              "8102921824"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28978.193517747914!2d84.9720059!3d24.786063!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32a5909100de7%3A0xf0ba6d42b239349f!2sVastu%20Vihar%20Gaya%20Office!5e0!3m2!1sen!2sin!4v1670049184824!5m2!1sen!2sin"
      },
      {
        "name": "Hajipur",
        "address": "Hajipur – Ramashish Chowk, R. Bhawan, 2nd Floor, Near Sadar Thana, Hajipur-844101",
        "email": "hajipur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Raushan Kumar (Project Manager)",
            "phones": [
              "7488538151"
            ]
          },
          {
            "name": "Anshu Verma (Marketing)",
            "phones": [
              "8102922387"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d115071.42622112147!2d85.1803882!3d25.6718891!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed5c47d0f9713d%3A0xb60fb5044b5233a1!2sVastu%20Vihar%20Hajipur%20Office!5e0!3m2!1sen!2sin!4v1670049263046!5m2!1sen!2sin"
      },
      {
        "name": "Jehanabad",
        "address": "Ainwan Jehanbad-Patna Road Near Piaggio Showroom Jehanabad, Bihar 804408",
        "email": "jehanabad@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Prabhat Kumar (Project Manager)",
            "phones": [
              "7488538179"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.60430988397!2d85.0117071!3d25.2502491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2b599807bee05%3A0x1d13c9658205fbc9!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670049407605!5m2!1sen!2sin"
      },
      {
        "name": "Katihar",
        "address": "B.M.P 7 Front Of Shivpuri Gate, Katihar-854105",
        "email": "katihar@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Rahul Pratap Singh (Project Manager)",
            "phones": [
              "8102921851",
              "8709396008"
            ]
          },
          {
            "name": "Subhash Kr Mallik (Marketing)",
            "phones": [
              "9386256002"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28791.297861319388!2d87.5334722!3d25.5745866!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39faaa1854dd31cf%3A0x9a001e8a3fae6006!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670049476824!5m2!1sen!2sin"
      },
      {
        "name": "Motihari",
        "address": "Nutan Kunj 2nd Floor Near YS Hotel, Kachhari Road Raja Bazar Motihari-845401",
        "email": "motihari@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Navlesh Kumar (Project Manager)",
            "phones": [
              "7488528332"
            ]
          },
          {
            "name": "Himanshu Raj (Marketing)",
            "phones": [
              "7488048393"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28530.186258912734!2d84.8703102!3d26.6397312!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399335458e9e91cf%3A0x9b66600a013c5deb!2sVastu%20Vihar%20Motihari!5e0!3m2!1sen!2sin!4v1670049569101!5m2!1sen!2sin"
      },
      {
        "name": "Muzaffarpur",
        "address": "1st Floor, Sudhha Trade centre, Near SBI Bank, Bhagwanpur Chowk, Muzaffarpur-842001",
        "email": "muzaffarpur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "H R Dhiraj (Project Manager)",
            "phones": [
              "7488535211"
            ]
          },
          {
            "name": "Manish Kumar (Marketing)",
            "phones": [
              "9334522266"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.3404682098276!2d85.3588671!3d26.120439700000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed10d274831b3d%3A0x72abbb5ad54b0f06!2sVastu%20Vihar%20Muzaffarpur!5e0!3m2!1sen!2sin!4v1670049647375!5m2!1sen!2sin"
      },
      {
        "name": "Munger",
        "address": "Safiyabad Chowk, Near Tata Motors Chandrapura ,Morcha Jamalpur - Munger 811214",
        "email": "munger@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Manish Kumar (Project Manager)",
            "phones": [
              "9386256130"
            ]
          },
          {
            "name": "Mohit Kumar (Project Manager)",
            "phones": [
              "8674892342"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3606.0122488780607!2d86.499094!3d25.33737!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xeb0203a7948e9c56!2sVastu%20Vihar%20Phase%201!5e0!3m2!1sen!2sin!4v1670054530472!5m2!1sen!2sin"
      },
      {
        "name": "Patna",
        "address": "B/2, 3rd Floor, Grand Chandra Apartment, Fraser Road, Patna-800001",
        "email": "patna@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Sunil Kumar Singh (Project Manager)",
            "phones": [
              "8102926293"
            ]
          },
          {
            "name": "Abhishek Kumar (Marketing)",
            "phones": [
              "8102926294"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14390.974608421375!2d85.1417083!3d25.6134332!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7658cc90b69ea236!2sVastu%20Vihar%20Patna%20Office!5e0!3m2!1sen!2sin!4v1670049810205!5m2!1sen!2sin"
      },
      {
        "name": "Purnia",
        "address": "Vastu Vihar Gulabbagh Gunda Chowk Near Ridhi Sidhi Petrol Pump, Purnea-854326",
        "email": "purnea@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Prakash Pandey (PM)",
            "phones": [
              "9523927064"
            ]
          },
          {
            "name": "Rohit Kr Pathak (Marketing)",
            "phones": [
              "7280023057"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14369.164869116255!2d87.4030515!3d25.7939649!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4b4bbef20de76dc!2sVastu%20Vihar%20Purnea%20Phase%201!5e0!3m2!1sen!2sin!4v1670049874614!5m2!1sen!2sin"
      },
      {
        "name": "Sasaram",
        "address": "Suman Market, Gaurakshni P.O- Sasaram, Dist -Rohtas, Sasaram-821115",
        "email": "sasaram@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Mashroor Alam (Project Manager)",
            "phones": [
              "7488047021"
            ]
          },
          {
            "name": "Uttam Kumar (Marketing)",
            "phones": [
              "7488047033"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14468.931306551387!2d84.015329!3d24.958192!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xd05cb6a42538c4b7!2sVastu%20Vihar%20Sasaram!5e0!3m2!1sen!2sin!4v1670049978185!5m2!1sen!2sin"
      },
      {
        "name": "Samastipur",
        "address": "1st Floor, B-Block Panchwati Complex, Near B.R.B. College, Mohanpur Road Samastipur 848101",
        "email": "samstipur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Satish Kumar (Project Manager)",
            "phones": [
              "9386256139"
            ]
          },
          {
            "name": "Sumit Kumar (Marketing)",
            "phones": [
              "6287798022"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14362.377900640651!2d85.7732291!3d25.8499048!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf79cd998f99ef5b2!2sVastu%20Vihar%20Samastipur!5e0!3m2!1sen!2sin!4v1670050156954!5m2!1sen!2sin"
      },
      {
        "name": "Saharsa",
        "address": "2nd Floor, Sahu Market, Gandhi Path, Beside BSNL Office, Saharsa-852201",
        "email": "saharsa@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "D.N Singh (Project Manager)",
            "phones": [
              "6201549148"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14358.393691499574!2d86.5907105!3d25.8826912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x9cc171969dbd5834!2sVastu%20Vihar%20Saharsa%20Office!5e0!3m2!1sen!2sin!4v1670050227944!5m2!1sen!2sin"
      },
      {
        "name": "Madhubani",
        "address": "Vastu Vihar Yamuna -1, Sahua Pandol Road Basuara,Nidhi chowk- Madhubani 847212",
        "email": "madhubani@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Vidyanand Mishra (Project Manager)",
            "phones": [
              "7970638109",
              "9386256105"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14305.462985366565!2d86.0606431!3d26.3146538!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xcfab7a8be4e3bdbe!2sVastu%20Vihar%20Madhubani%20Phase%201!5e0!3m2!1sen!2sin!4v1670050402994!5m2!1sen!2sin"
      },
      {
        "name": "Sitamarhi",
        "address": "Vastu Vihar Godawari -04, Kailashpuri, Bhau Prasad Road, Near Kali Mandir Dumra- Sitamarhi-843302",
        "email": "sitamarhi@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Sanjeev Kumar Jha (Project Manager)",
            "phones": [
              "7488538125"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14275.719139103097!2d85.5136981!3d26.5545235!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x206928b3dff4e252!2sVastu%20Vihar%20Sitamarhi!5e0!3m2!1sen!2sin!4v1670050507633!5m2!1sen!2sin"
      },
      {
        "name": "Siwan",
        "address": "Yamuna small-02,Behind FCI Godown, Bhada Kala, Dist-Siwan-841226",
        "email": "siwan@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Jitendra Sinha (Project Manager)",
            "phones": [
              "7488538129"
            ]
          },
          {
            "name": "Pankaj Kumar (Marketing)",
            "phones": [
              "8651056979"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28632.57277047651!2d84.2866446!3d26.2268631!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3992ffddee3613b7%3A0x40ee5d102e54c215!2sVastu%20Vihar%20Phase%201!5e0!3m2!1sen!2sin!4v1670050599511!5m2!1sen!2sin"
      },
      {
        "name": "Chhapra",
        "address": "Ratanpura Bindtoliya Chapra, Vastu Vihar Ph-1, 3rd Floor Shopping Complex, Chapra-841301",
        "email": "chapra@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Tanay Kumar Ojha (Project Manager)",
            "phones": [
              "8102921832"
            ]
          },
          {
            "name": "Gaurav Kumar Singh (Marketing)",
            "phones": [
              "8651099196"
            ]
          },
          {
            "name": "Bhupendra Singh (Site Eng.)",
            "phones": [
              "7462858600"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d873.2587795436373!2d84.72991619999999!3d25.7992498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3992bb9f7424caed%3A0xa30af9c1738c8fb7!2sVastu%20Vihar%20Chapra%20Phase%201!5e0!3m2!1sen!2sin!4v1670050962926!5m2!1sen!2sin"
      }
    ]
  },
  {
    "state": "Jharkhand",
    "branches": [
      {
        "name": "Bokaro",
        "address": "Plot No.-HD 15, Behind Nutkhut Sweets Sec-IV, City Centre, B.S.city Bokaro-827004",
        "email": "bokaro@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Shashi Shekhar (Project Manager)",
            "phones": [
              "9835347367",
              "7488538184"
            ]
          },
          {
            "name": "Dilip Kumar (Marketing)",
            "phones": [
              "8102921847"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14616.94870394421!2d86.1470304!3d23.6674748!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfcea8ec8a2e2eef9!2sVastu%20Vihar%20Office!5e0!3m2!1sen!2sin!4v1670051561233!5m2!1sen!2sin"
      },
      {
        "name": "Deoghar",
        "address": "Hanuman Tikri Front Of Jalsar Park Gate, Deoghar-814112",
        "email": "deoghar@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Hemlal Mahato (General Manager)",
            "phones": [
              "7488538169"
            ]
          },
          {
            "name": "Deepak Singh (Project Manager)",
            "phones": [
              "7488659801"
            ]
          },
          {
            "name": "Shakti Kumari (Marketing)",
            "phones": [
              "7488047026"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29046.30055974197!2d86.6849045!3d24.4928162!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f11626f1cd9879%3A0xd757abd767ad9065!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670051629013!5m2!1sen!2sin"
      },
      {
        "name": "Dhanbad",
        "address": "Hem Tower, Flat-4B 1st Floor, Luby Circular Road, Randhir Verma Chowk, Dhanbad-826007",
        "email": "dhanbad@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Somnath Nandi (Project Manager)",
            "phones": [
              "7488535262"
            ]
          },
          {
            "name": "Abhimanyu Kr Gope (Marketing)",
            "phones": [
              "7488535267"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d116816.7234017031!2d86.3672536!3d23.8000085!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6bcbdd9cc780b%3A0x33fca32d7c04ec8d!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670051801336!5m2!1sen!2sin"
      },
      {
        "name": "Giridih",
        "address": "Court Road, Bank Of India Building Near Navjeevan Nursing Home, Giridih Jharkhand-815301",
        "email": "giridih@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Mihir Thakur (Project Manager)",
            "phones": [
              "6205510322"
            ]
          },
          {
            "name": "Mihir Thakur (Head Marketing)",
            "phones": [
              "7033170888"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14557.964109922654!2d86.3066859!3d24.1895766!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdafd311923bb934b!2sVastu%20Vihar%20Giridih%20Office!5e0!3m2!1sen!2sin!4v1670051863420!5m2!1sen!2sin"
      },
      {
        "name": "Hazaribagh",
        "address": "Vastu vihar colony, NH-33, Patna-Ranchi Road Mukundganj Chowk, Hazaribagh-825301",
        "email": "hazaribagh@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Nishant Kumar (Project Manager)",
            "phones": [
              "7970638109"
            ]
          },
          {
            "name": "Vikrant Kumar (Marketing)",
            "phones": [
              "8102921849"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14585.935551795386!2d85.3729685!3d23.9433234!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x35e469fa9704a5f0!2sVastu%20Vihar%20Hazaribagh!5e0!3m2!1sen!2sin!4v1670051940786!5m2!1sen!2sin"
      },
      {
        "name": "Jamshedpur",
        "address": "518-519, 5th Floor, Asiana Trade Centre, Adityapur, Jamshedpur-831013",
        "email": "jamshedpur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Abhishek Kumar (Project Manager)",
            "phones": [
              "7488535221"
            ]
          },
          {
            "name": "Rohit Kumar (Marketing)",
            "phones": [
              "7488535258"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m16!1m10!1m3!1d117716.61873654278!2d86.1319351!3d22.78114!2m1!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e4ead680326d%3A0x263c73ccdecbb5bf!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670052030561!5m2!1sen!2sin"
      },
      {
        "name": "Ranchi",
        "address": "2nd Floor, UNI Height, Kantatoli Chowk, Ranchi-834001",
        "email": "ranchi@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Rishikesh Mishra (Project Manager)",
            "phones": [
              "7280023038"
            ]
          },
          {
            "name": "Ajeet Kumar (Marketing)",
            "phones": [
              "9031841659"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29300.92803524995!2d85.3357973!3d23.3659225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e17953fbb4bb%3A0xd122cfa1030ee11f!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670052376061!5m2!1sen!2sin"
      }
    ]
  },
  {
    "state": "West Bengal",
    "branches": [
      {
        "name": "Alipurduar",
        "address": "Vastu Vihar, Bairaguri, PO-Ghagra, PS+Dist-Alipurduar Pin-736122 West Bengal",
        "email": "alipurduar@vastuvihar.org",
        "phones": [
          "8170028993",
          "8170028994"
        ],
        "people": [
          {
            "name": "Vivek Kumar (Project Manager)",
            "phones": [
              "8170028993"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d733.0602581692492!2d89.51542215544075!3d26.52665855317242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x192ba270b7aee6db!2sVastu%20Vihar%20Alipurduar!5e0!3m2!1sen!2sin!4v1670052485181!5m2!1sen!2sin"
      },
      {
        "name": "Asansol",
        "address": "NH-2, Garui, Kanyapur, Asansol (N) Ward No-31 Burdman Near Asansol Engineering College, Asansol - 713304",
        "email": "asansol@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Ravi Prakesh (Project Manager)",
            "phones": [
              "6287895074"
            ]
          },
          {
            "name": "Govind Mukherjee (Marketing)",
            "phones": [
              "7797701012"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d116888.79790081423!2d86.8662746!3d23.71973!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f71f2f183cbee3%3A0xbfe122349c08c981!2sVastu%20Vihar%20Phase%201%2C%20Asansol!5e0!3m2!1sen!2sin!4v1670146807221!5m2!1sen!2sin"
      },
      {
        "name": "Durgapur",
        "address": "14/16 Sepco Township Near Jol Tanki, Durgapur-713205",
        "email": "durgapur@vastuvihar.org",
        "phones": [
          "7797701014",
          "7797701015"
        ],
        "people": [
          {
            "name": "Chiranjit Pal (Project Manager)",
            "phones": [
              "7797701014"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d58523.5925076395!2d87.2354031!3d23.5424082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f77201e3c80275%3A0x7a46744a8868ae5f!2sVastu%20Vihar%20Durgapur!5e0!3m2!1sen!2sin!4v1670053289878!5m2!1sen!2sin"
      },
      {
        "name": "Kolkata",
        "address": "Vastu Vihar Near Bhojerhat Bridge, At-Krolbaria, PO-Beonta-1, PS-Kolkata Lether Complex,Behind New Town, South 24 Pargana 743502",
        "email": "kolkata@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Naimul Haque (Project Manager)",
            "phones": [
              "8100915974"
            ]
          },
          {
            "name": "Souman Datta (Marketing)",
            "phones": [
              "7070362666"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1851.0156571164625!2d88.53184250000004!3d22.5114383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x71fac3dab75c029e!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670053368568!5m2!1sen!2sin"
      },
      {
        "name": "Siliguri",
        "address": "Joshi Kunj, 1st Floor, Opp:-Aakashwani Bhawan, 2nd mile Sevoke Road, Siliguri-734001, Jalpaiguri",
        "email": "siliguri@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Rakesh Ranjan (Project Manager)",
            "phones": [
              "6287798021"
            ]
          },
          {
            "name": "Puja Mandal (Marketing)",
            "phones": [
              "8100193607"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.2584938573164!2d88.433448!3d26.736126000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4410398e9f8d3%3A0x389676410e2e5177!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670053415549!5m2!1sen!2sin"
      }
    ]
  },
  {
    "state": "Uttar Pradesh",
    "branches": [
      {
        "name": "Gorakhpur",
        "address": "Vastu Vihar, Ganga Apartment, C Block, Siktaur, Near Sahara Estate, Deoria Bypass Road, Gorakhpur UP-273010",
        "email": "gorakhpur@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Pranav Kumar Singh (Project Manager)",
            "phones": [
              "7903611173"
            ]
          },
          {
            "name": "Vikash Kumar (Marketing)",
            "phones": [
              "9369997218"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d867.5119764933897!2d83.42021517914031!3d26.70488424099558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x361f517a517483!2sVastu%20Vihar%20Phase%201!5e0!3m2!1sen!2sin!4v1670053498201!5m2!1sen!2sin"
      },
      {
        "name": "Mirzapur",
        "address": "Vastu Vihar Near Atal Chowk,Sagra Vindhyachal Dham, Mirzapur Allahabad Highway Pin-231307",
        "email": "mirzapur@vastuvihar.org",
        "phones": [
          "9369997221"
        ],
        "people": [
          {
            "name": "Sanjay Kumar Singh (Project Manager)",
            "phones": [
              "9336341114"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d760.7514165854934!2d82.51101270000002!3d25.154653799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398feb5f4fabcdd1%3A0xf21f41dca442a36f!2sVastu%20Vihar!5e0!3m2!1sen!2sin!4v1670147432798!5m2!1sen!2sin"
      },
      {
        "name": "Varanasi",
        "address": "Vastu Vihar, C/O-Rajeshwaram, B 25/33-192, Jawahar Nagar Extension Colony, Hanuman pura,Near Guru Dham Chowraha, Varanasi (UP) PIN-221010",
        "email": "varanasi@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Sanjay Singh (Project Manager)",
            "phones": [
              "9336341114"
            ]
          },
          {
            "name": "Ashutosh Singh (Marketing)",
            "phones": [
              "9369997215"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.316487769804!2d82.9973799!3d25.293568699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e314eb92dff49%3A0xd39239281e8ce712!2sVastu%20Vihar%20Varanasi%20Office!5e0!3m2!1sen!2sin!4v1670054641602!5m2!1sen!2sin"
      }
    ]
  },
  {
    "state": "Odisha",
    "branches": [
      {
        "name": "Bhubaneshwar",
        "address": "At-G-2, Gaonpada(Grass Farm), Near Pipli Toll Gate, PO+PS-Pipli, Distt-Puri, Pin-752104 Odisha",
        "email": "bhubaneswar@vastuvihar.org",
        "phones": [],
        "people": [
          {
            "name": "Saket Kumar Srivastav (Project Manager)",
            "phones": [
              "9031629545"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2227.2820648515503!2d85.8329139956203!3d20.133147610816984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x279669c59ad0e2f2!2sVastu%20Vihar%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1670053676331!5m2!1sen!2sin"
      },
      {
        "name": "Rourkela",
        "address": "Vastu Vihar, Khata No-133/134, Plot No-613, Padampur, Kuarmunda, Sundargarh, Odisha-770039",
        "email": "rourkela@vastuvihar.org",
        "phones": [
          "7283007980",
          "6287798032"
        ],
        "people": [
          {
            "name": "Arjun Deep (Project Manager)",
            "phones": [
              "7283007980"
            ]
          },
          {
            "name": "Abhishek Pandey (Marketing)",
            "phones": [
              "6287798032"
            ]
          }
        ],
        "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2620.390906256249!2d84.7764769!3d22.2546483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x67ff9f5e46a6782d!2sVastu%20Vihar%20Rourkela!5e0!3m2!1sen!2sin!4v1670053797308!5m2!1sen!2sin"
      }
    ]
  }
];

const TOTAL_BRANCHES = BRANCH_GROUPS.reduce((sum, group) => sum + group.branches.length, 0);

function Icon({ name, size = 18 }) {
  const a = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  };
  switch (name) {
    case 'search': return <svg {...a}><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>;
    case 'chevron': return <svg {...a}><path d="m6 9 6 6 6-6"/></svg>;
    case 'pin': return <svg {...a}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'phone': return <svg {...a}><path d="M22 16.6v2.7a2.2 2.2 0 0 1-2.4 2.2A20.2 20.2 0 0 1 2.5 4.4 2.2 2.2 0 0 1 4.7 2h2.7a2 2 0 0 1 2 1.7l.5 2.9a2 2 0 0 1-.6 1.9L8 9.8a16.6 16.6 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 1.9-.6l2.9.5a2 2 0 0 1 1.7 2.2Z"/></svg>;
    case 'mail': return <svg {...a}><rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="m3 6 9 7 9-7"/></svg>;
    case 'user': return <svg {...a}><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
    case 'arrow': return <svg {...a}><path d="M7 17 17 7M8 7h9v9"/></svg>;
    case 'x': return <svg {...a}><path d="M5 5 19 19M19 5 5 19"/></svg>;
    default: return null;
  }
}

function Phones({ phones }) {
  if (!phones?.length) return null;
  return (
    <div className={styles.phoneList}>
      {phones.map((phone, index) => {
        const clean = String(phone).replace(/[^\d]/g, '');
        return clean.length === 10 ? (
          <a key={`${phone}-${index}`} href={`tel:+91${clean}`}>{phone}</a>
        ) : (
          <span key={`${phone}-${index}`}>{phone}</span>
        );
      })}
    </div>
  );
}

function SplitPerson({ person }) {
  // Keep the original name/role information; the role is printed in parentheses in source.
  const match = person.name.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  const displayName = match ? match[1] : person.name;
  const role = match ? match[2] : '';
  return (
    <div className={styles.person}>
      <span className={styles.detailIcon}><Icon name="user" size={17}/></span>
      <div className={styles.personInfo}>
        <strong>{displayName}</strong>
        {role && <small>{role}</small>}
        <Phones phones={person.phones}/>
      </div>
    </div>
  );
}

function BranchCard({ branch, state }) {
  const [showMap, setShowMap] = useState(false);
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [branch.name, branch.address, state, 'India'].join(', ')
  )}`;
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardEyebrow}>Vastu Vihar branch</span>
        <h3 className={styles.cardTitle}>{branch.name}</h3>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <span className={styles.detailIcon}><Icon name="pin"/></span>
          <p>{branch.address}</p>
        </div>
        {branch.email && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="mail"/></span>
            <a href={`mailto:${branch.email}`}>{branch.email}</a>
          </div>
        )}
        {branch.phones?.length > 0 && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="phone"/></span>
            <Phones phones={branch.phones}/>
          </div>
        )}
        {branch.people?.length > 0 && (
          <div className={styles.people}>
            <span className={styles.peopleTitle}>Branch contacts</span>
            {branch.people.map((person, index) => (
              <SplitPerson key={`${person.name}-${index}`} person={person}/>
            ))}
          </div>
        )}
      </div>

      <div className={styles.cardActions}>
        <button type="button" className={styles.mapButton}
          onClick={() => setShowMap((value) => !value)} aria-expanded={showMap}
          aria-label={`${showMap ? 'Hide' : 'Show'} map for ${branch.name}`}>
          {showMap ? 'Hide map' : 'Show map'} <Icon name="chevron" size={16}/>
        </button>
        <a className={styles.mapLink} href={mapSearch} target="_blank" rel="noopener noreferrer">
          Directions <Icon name="arrow" size={17}/>
        </a>
      </div>
      {showMap && (
        <div className={styles.mapPanel}>
          <iframe title={`${branch.name} Vastu Vihar map`}
            src={branch.mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen />
        </div>
      )}
    </article>
  );
}

function Directory() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const cities = useMemo(() => {
    const allowed = BRANCH_GROUPS.filter((g) => !state || g.state === state);
    return [...new Set(allowed.flatMap((g) => g.branches.map((b) => b.name)))].sort();
  }, [state]);

  const groups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return BRANCH_GROUPS
      .filter((group) => !state || group.state === state)
      .map((group) => ({
        ...group,
        branches: group.branches.filter((branch) => {
          if (city && branch.name !== city) return false;
          if (!needle) return true;
          const searchable = [
            group.state, branch.name, branch.address, branch.email || '',
            ...(branch.phones || []),
            ...(branch.people || []).flatMap((p) => [p.name, ...(p.phones || [])]),
          ].join(' ').toLowerCase();
          return searchable.includes(needle);
        }),
      }))
      .filter((group) => group.branches.length > 0);
  }, [search, state, city]);

  const count = groups.reduce((sum, group) => sum + group.branches.length, 0);
  const filtered = Boolean(search || state || city);
  const clear = () => { setSearch(''); setState(''); setCity(''); };

  return (
    <section className={styles.directory} aria-label="Vastu Vihar branch contacts">
      {/* Search comes first, as on the updated Site Contact page. */}
      <div className={styles.filters} role="search" aria-label="Branch contact filters">
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-search">Search branches</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><Icon name="search" size={19}/></span>
            <input id="branch-search" type="search" className={styles.input}
              placeholder="Search city, team member, phone or address" value={search}
              onChange={(e) => setSearch(e.target.value)}/>
            {search && <button type="button" className={styles.clearInput}
              onClick={() => setSearch('')} aria-label="Clear search"><Icon name="x" size={16}/></button>}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-state">State</label>
          <div className={styles.inputWrap}>
            <select id="branch-state" className={styles.select} value={state}
              onChange={(e) => { setState(e.target.value); setCity(''); }}>
              <option value="">All states</option>
              {BRANCH_GROUPS.map((group) => (
                <option value={group.state} key={group.state}>{group.state}</option>
              ))}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-city">City</label>
          <div className={styles.inputWrap}>
            <select id="branch-city" className={styles.select} value={city}
              onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
      </div>

      <div className={styles.resultsInfo} aria-live="polite">
        <p>Showing <strong>{count}</strong> of {TOTAL_BRANCHES} branches</p>
        {filtered && <button type="button" className={styles.reset} onClick={clear}>
          Clear filters <Icon name="x" size={15}/>
        </button>}
      </div>

      {groups.length ? (
        <div className={styles.results}>
          {groups.map((group) => (
            <section key={group.state} className={styles.stateSection} aria-label={group.state}>
              <div className={styles.stateHeading}>
                <h2>{group.state}</h2>
                <span>{group.branches.length} {group.branches.length === 1 ? 'branch' : 'branches'}</span>
              </div>
              <div className={styles.cardGrid}>
                {group.branches.map((branch) => (
                  <BranchCard key={`${group.state}-${branch.name}`} state={group.state} branch={branch}/>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <Icon name="search" size={32}/>
          <h2>No matching branches found</h2>
          <p>Try another city, name, telephone number or state.</p>
          <button type="button" onClick={clear}>View all branches</button>
        </div>
      )}
    </section>
  );
}

export default function BranchContactPage() {
  return (
    <PageLayout route="contact">
      <Breadcrumb title="Branch Contact"/>
      <div id="content" className={`site-content-page clear ${styles.page}`} tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="61" className="elementor elementor-61">
                <div className={`elementor-element elementor-element-dd4cc01 e-con-full e-flex e-con e-parent ${styles.banner}`}>
                  <div className={`elementor-element elementor-element-49de9ae e-flex e-con-boxed e-con e-child ${styles.bannerBox}`}>
                    <div className={`e-con-inner ${styles.bannerInner}`}>
                      <div className="elementor-element elementor-element-03bf66d elementor-widget elementor-widget-page-title">
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h1 className="elementor-heading-title elementor-size-default">Branch Contact</h1>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-f99e958 e-con-full e-flex e-con e-child">
                        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                          <Link href="/" prefetch={false}>Home</Link>
                          <span aria-hidden="true">/</span>
                          <Link href="/contact" prefetch={false}>Contact</Link>
                          <span aria-hidden="true">/</span>
                          <span aria-current="page">Branch Contact</span>
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
