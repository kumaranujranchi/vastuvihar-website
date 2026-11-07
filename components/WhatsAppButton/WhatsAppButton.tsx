import styles from './WhatsAppButton.module.css';

const WHATSAPP_NUMBER = '919534095340';
const DEFAULT_MESSAGE = 'Hello Vastu Vihar, I would like to know more about your projects.';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      className={styles.button}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.004 3C8.82 3 3 8.82 3 16.002c0 2.293.6 4.533 1.74 6.508L3 29l6.66-1.71a12.96 12.96 0 0 0 6.34 1.65h.005C23.184 28.94 29 23.12 29 15.94 29 8.82 23.184 3 16.004 3Zm0 23.74h-.004a10.77 10.77 0 0 1-5.49-1.503l-.394-.234-3.953 1.015 1.055-3.85-.257-.395a10.73 10.73 0 0 1-1.65-5.77c0-5.94 4.835-10.775 10.78-10.775 5.94 0 10.775 4.835 10.775 10.715 0 5.94-4.835 10.797-10.862 10.797Zm5.91-8.07c-.324-.162-1.917-.946-2.214-1.054-.297-.108-.513-.162-.729.162-.216.324-.837 1.054-1.026 1.27-.189.216-.378.243-.702.081-.324-.162-1.368-.504-2.606-1.608-.963-.859-1.613-1.92-1.802-2.244-.189-.324-.02-.499.142-.66.146-.145.324-.378.486-.567.162-.189.216-.324.324-.54.108-.216.054-.405-.027-.567-.081-.162-.729-1.757-.999-2.405-.263-.632-.53-.546-.729-.556l-.621-.011a1.19 1.19 0 0 0-.864.405c-.297.324-1.134 1.108-1.134 2.702s1.161 3.134 1.323 3.35c.162.216 2.285 3.49 5.536 4.894.774.334 1.378.533 1.849.683.777.247 1.484.212 2.043.129.623-.093 1.917-.784 2.188-1.54.27-.757.27-1.405.189-1.54-.081-.135-.297-.216-.621-.378Z"
        />
      </svg>
    </a>
  );
}
