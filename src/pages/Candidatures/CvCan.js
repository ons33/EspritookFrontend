import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import {HiLocationMarker,HiOfficeBuilding,HiOutlineMail,HiPhone} from 'react-icons/hi';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    
    backgroundColor: '#f4f4f4',
  },
  leftColumnContainer: {
    width: '35%',
    padding:9,
    paddingRight: 20,
    backgroundColor: "#2d3b48",
    marginRight: 20, // Add marginRight to cover padding
  },
  leftColumn: {
    width: '100%', // Adjust width to cover the container
  },
  rightColumn: {
    width: '65%',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  headingg: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#cccccc',
  },
  content: {
    fontSize: 11,
    marginBottom: 5,
    color: '#ffffff',
  },
  contentt: {
    fontSize: 40,
    color: '#181818',
    marginTop:'20px',
  },
  contenttt: {
    fontSize: 12,
    marginBottom: 5,
    color: '#b0b0b0',
  },
  conten: {
    fontSize: 18,
    marginBottom: 5,
    color: '#181818',
    marginTop:'10px',

  },
  bullet: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  bullett: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ffffff',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: '50%',
  },
  experienceContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
const CvCan = ({ user, experiences, competences, educations }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftColumnContainer}>
          <View style={styles.leftColumn}>
            <Image src="https://cdn-icons-png.flaticon.com/512/3541/3541871.png" style={styles.avatar} />
            <View style={styles.section}>
              <Text style={styles.headingg}>Personal Information</Text>
              <View style={styles.divider} />
              <Text style={styles.content}><HiOutlineMail size={30} className="p-1"/>{user?.email}</Text>
              <Text style={styles.content}><HiPhone size={30} className="p-1"/>{user?.phoneNumber}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.headingg}>Competences</Text>
              <View style={styles.divider} />
              {competences ? (
                competences.map((competence, index) => (
                  <View key={index} style={styles.section}>
                    <Text style={styles.bullett}>- {competence.nomCompetence}: {competence.niveauMaitrise}</Text>
                  </View>
                ))
              ) : (
                <Text>No competences available.</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.section}>
          <Text style={styles.contentt}> {user?.firstName} {user?.lastName}</Text>
          <Text style={styles.conten}>Esprit Student</Text>
          
          <Text style={styles.contenttt}>Tunis, Tunisia</Text>

       
            <Text style={styles.heading}>Experiences</Text>
            <View style={styles.divider} />
            {experiences.map((experience, index) => (
              <View key={index} style={styles.experienceContent}>
                <View style={{ marginRight: 10 }}>
                <Text style={styles.bullet}>
    - {experience.nomEntreprise}, {experience.poste} ({formatDate(experience.dateDebut)} to {formatDate(experience.dateFin)})
  </Text>
  {experience.description && <Text style={styles.contenttt}>{experience.description}</Text>}
  </View>
</View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Educations</Text>
            <View style={styles.divider} />
            {educations ? (
              educations.map((education, index) => (
                <View key={index} style={styles.section}>
                <Text style={styles.bullet}>
                  - {education.diplome}, Ecole: {education.ecole} ({formatDate(education.dateDebut)} to {formatDate(education.dateFin)})
                </Text>
                {education.description && <Text style={styles.contenttt}>{education.description}</Text>}
              </View>
              ))
            ) : (
              <Text>No educations available.</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CvCan;
