# Use the Java 8 base image
FROM eclipse-temurin:8-jdk

# Create application directory
RUN mkdir -p /usr/local/hl7-igamt

# Copy the generated JAR file into the container
COPY hl7-igamt.jar /usr/local/hl7-igamt/hl7-igamt.jar

# Define the default command to run the application
CMD ["java", "-Xmx900m", "-Xss256k", "-Djava.security.egd=file:/dev/./urandom", "-Dspring.profiles.active=${PROFILE}", "-Ddb.name=${MONGO_INITDB_DATABASE}", "-Ddb.host=hl7-igamt-db", "-Ddb.port=27017", "-Dkey.public=/usr/local/hl7-igamt/keys/publicKey.txt", "-Dauth.url=${AUTH_HOST}", "-Dhost.url=${HOST_URL}", "-Dvocabulary.url=${VOCAB_URL}","-Demail.from=${EMAIL_FROM}", "-Demail.admin=${EMAIL_ADMIN}", "-Demail.subject=${EMAIL_SUBJECT}" , "-Demail.host=${EMAIL_HOST}", "-Dfroala.key=${FROALA_KEY}" , "-jar", "/usr/local/hl7-igamt/hl7-igamt.jar"]
