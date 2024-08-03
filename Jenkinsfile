pipeline {
    agent any

    triggers {
        githubPush()
    }

    // parameters for managing Docker Image
    parameters {
        string(name: 'FRONT_IMAGE_NAME', defaultValue: 'front-image', description: 'Frontend Docker Image Name')
        string(name: 'BACK_IMAGE_NAME', defaultValue: 'backend-image', description: 'Backend Docker Image Name')
        string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker Image Tag')
        text(name: 'frontendEnv', defaultValue: '', description: 'Frontend .env file')
        text(name: 'backendEnv', defaultValue: '', description: 'Backend .env file')
    }
    //
    stages {
        stage('SonarQube Scan') {
            steps {
              script{
                    // Set SonarScanner path
                    def scannerHome = '/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarScanner'
                    withSonarQubeEnv('Sonar-Server') {
                    // Use SonarScanner tool
                    tool 'SonarScanner'
                    sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=AirbnbClone-Scan"
                  }
               }
            }
        }

    stage('Preparation') {
        steps {
            script {
                def frontImageName = params.FRONT_IMAGE_NAME
                def backImageName = params.BACK_IMAGE_NAME
                def imageTag = params.IMAGE_TAG

                // SSH command prefix
                def sshPrefix = 'ssh ubuntu@Docker-Server IP address' // Docker-Server

                // Combined SSH command to verify and delete frontend image
                def sshCommandFront = """
                    ${sshPrefix} << 'EOF'
                        existingFrontContainer=\$(docker ps -aqf "name=frontend-container")
                        if [ -n "\$existingFrontContainer" ]; then
                            docker stop \$existingFrontContainer
                            docker rm \$existingFrontContainer
                        fi
                        existingFrontImage=\$(docker images -q ${frontImageName}:${imageTag})
                        if [ -n "\$existingFrontImage" ]; then
                            docker rmi \$existingFrontImage
                        fi
                    EOF
                """.stripIndent()
                sh sshCommandFront

                // Combined SSH command to verify and delete backend image
                def sshCommandBack = """
                    ${sshPrefix} << 'EOF'
                        existingBackContainer=\$(docker ps -aqf "name=backend-container")
                        if [ -n "\$existingBackContainer" ]; then
                            docker stop \$existingBackContainer
                            docker rm \$existingBackContainer
                        fi
                        existingBackImage=\$(docker images -q ${backImageName}:${imageTag})
                        if [ -n "\$existingBackImage" ]; then
                            docker rmi \$existingBackImage
                        fi
                    EOF
                """.stripIndent()
                sh sshCommandBack
                    }
                }
            }

        stage('Build and Deploy') {
          steps {
             script {
            // SSH command prefix
            def sshPrefix = 'ssh ubuntu@Docker-Server IP address' // Docker-Server

            // Docker-Server
            def dockerServer = 'ubuntu@Docker-Server IP address' // Docker-Server

            // Github repository
            def gitRepo = 'git@github.com:xxx/IntegrationPRJ.git'

            // Parameters for Image management
            def frontImageName = params.FRONT_IMAGE_NAME
            def backImageName = params.BACK_IMAGE_NAME
            def imageTag = params.IMAGE_TAG

            // Parameters for environement data
            def front_env = params.frontendEnv
            def back_env = params.backendEnv

            // Clone repository on Jenkins server
            git branch: 'main', credentialsId: 'Jenkins-sshKey', url: gitRepo

            // Execute commands on the remote server
            sh """
            ${sshPrefix} '
            if [ -d "teamPRJ" ]; then
                rm -rf teamPRJ/*
            else
                mkdir -p teamPRJ
            fi' &&
            scp -r ${WORKSPACE}/* ${dockerServer}:teamPRJ &&
            echo "${front_env}" > frontEnv &&
            scp -r frontEnv ${dockerServer}:teamPRJ/frontend/.env &&
            echo "${back_env}" > backEnv &&
            scp backEnv ${dockerServer}:teamPRJ/backend/.env &&
            ${sshPrefix} '
            cd teamPRJ &&
            docker build -t ${frontImageName}:${imageTag} -f ./frontend/Dockerfile . &&
            docker build -t ${backImageName}:${imageTag} -f ./backend/Dockerfile .
            '
            """
                }
            }
        }
    }
}