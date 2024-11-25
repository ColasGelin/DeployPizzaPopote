import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalMentionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalMentions: React.FC<LegalMentionsProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000000ee',
            color: 'white',
            zIndex: 1000,
            padding: '2rem',
            overflow: 'auto',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              zIndex: 1001,
            }}
          >
            ×
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto', 
              paddingTop: '2rem',
            }}
          >
            <motion.h1 
              style={{ 
                marginBottom: '2rem', 
                fontSize: '2rem',
                color: 'white'
              }}
            >
              Mentions Légales
            </motion.h1>

            {[
              {
                title: "1. Développement et maintenance",
                content: (
                  <p>
                    Ce site a été développé par [Votre nom/société]<br />
                    SIRET : [Votre SIRET]<br />
                    Email : [Votre email professionnel]<br />
                    Le développeur n&apos;poteest pas responsable de la mise à jour des contenus du site.
                  </p>
                )
              },
              {
                title: "2. Propriétaire du site",
                content: (
                  <p>
                    Le site est la propriété de :<br />
                    Pizza Popote<br />
                    Contact : pizzapopote@gmail.com<br />
                    Les contenus du site (textes, images, logo) sont la propriété de Pizza Popote.
                  </p>
                )
              },
              {
                title: "3. Hébergement",
                content: (
                  <p>Ce site est hébergé par [Nom de l&apos;potehébergeur]<br />
                     [Adresse de l&apos;potehébergeur]<br />
                     [Contact de l&apos;potehébergeur]
                  </p>
                )
              },
              {
                title: "4. Données personnelles et cookies",
                content: (
                  <p>
                    Ce site est purement informatif et ne collecte aucune donnée personnelle des visiteurs. 
                    Aucun cookie n&apos;poteest utilisé pour le suivi des utilisateurs.
                    Le site peut utiliser des cookies techniques essentiels au fonctionnement du site.
                  </p>
                )
              },
              {
                title: "5. Propriété intellectuelle",
                content: (
                  <p>
                    Le code source du site est la propriété du développeur. 
                    Les contenus (textes, images, logo) sont la propriété de Pizza Popote.
                    Toute reproduction non autorisée des éléments du site constitue une violation des droits d&apos;poteauteur.
                  </p>
                )
              },
              {
                title: "6. Limitation de responsabilité",
                content: (
                  <p>
                    Le développeur s&apos;efforce d&apos;poteassurer au mieux de ses possibilités l&apos;poteexactitude et la mise à jour des informations diffusées, dont il se réserve le droit de corriger le contenu à tout moment. 
                    Le développeur n&apos;poteest responsable que du code source et de l&apos;potearchitecture technique du site.
                    Le contenu éditorial est sous la responsabilité de Pizza Popote.
                  </p>
                )
              }
            ].map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                style={{ 
                  marginBottom: '2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <motion.h2 
                  style={{ 
                    marginBottom: '1rem', 
                    fontSize: '1.5rem',
                    color: 'white'
                  }}
                >
                  {section.title}
                </motion.h2>
                <motion.div style={{ color: 'white', lineHeight: '1.6' }}>
                  {section.content}
                </motion.div>
              </motion.section>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalMentions;