
import Image from 'next/image';
import styles from './FinancePartners.module.css';

const BANK_PARTNERS = [
  { name: 'Axis Bank', logo: 'axis-bank.svg' },
  { name: 'Bank of Baroda', logo: 'bank-of-baroda.svg' },
  { name: 'Bank of India', logo: 'bank-of-india.svg' },
  { name: 'Bank of Maharashtra', logo: 'bank-of-maharashtra.svg' },
  { name: 'Canara Bank', logo: 'canara-bank.svg' },
  { name: 'Central Bank of India', logo: 'central-bank-of-india.svg' },
  { name: 'HDFC Bank', logo: 'hdfc-bank.svg' },
  { name: 'IDBI Bank', logo: 'idbi-bank.svg' },
  { name: 'Indian Bank', logo: 'indian-bank.svg' },
  { name: 'Jharkhand Gramin Bank', logo: 'jharkhand-gramin-bank.svg' },
  { name: 'LIC Housing Finance', logo: 'lic-housing-finance.svg' },
  { name: 'Punjab National Bank', logo: 'punjab-national-bank.svg' },
  { name: 'State Bank of India', logo: 'state-bank-of-india.svg' },
  { name: 'Union Bank of India', logo: 'union-bank-of-india.svg' },
];

export default function FinancePartners() {
  return (
    <section
      className={styles.section}
      aria-labelledby="finance-partners-heading"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <h2 id="finance-partners-heading">
            Our Banking &amp; Finance Partners
          </h2>

          <p>
            Explore our network of banking and housing finance
            partners for your home financing needs.
          </p>
        </div>

        <div className={styles.bankTable}>
          {BANK_PARTNERS.map((bank) => (
            <div
              key={bank.logo}
              className={styles.bankCell}
              title={bank.name}
            >
              <Image
                src={`/bank-svg/${bank.logo}`}
                alt={bank.name}
                width={190}
                height={90}
                className={styles.bankLogo}
                unoptimized
              />
            </div>
          ))}
        </div>

        <p className={styles.disclaimer}>
          Loan eligibility, approval, interest rates and terms
          are subject to the respective financial institution.
        </p>
      </div>
    </section>
  );
}
