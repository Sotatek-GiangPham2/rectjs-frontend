// Jenkinsfile for building and deploying React.js frontend

def appSourceRepo = 'https://github.com/Sotatek-GiangPham2/rectjs-frontend.git'
def appSourceBranch = 'staging'

def appConfigRepo = 'https://github.com/SotaBox/sotabox_infrastructure.git'
def appConfigBranch = 'staging'
def helmRepo = "k8s/accounts/stg/config/apps/core/test"
def helmChart = "app-demo"
def helmValueFile = "values.yaml"

def dockerhubAccount = 'dockerhub'
def githubAccount = 'github_source'

def version = "v1.${BUILD_NUMBER}"

pipeline {
    agent any    

    environment {
        PROJECT = "dev-sota-data-platform"
        APP_NAME = "test"
        REPO_NAME = "sotabox-registry"
        REPO_LOCATION = "asia-northeast1"
        IMAGE_NAME = "${REPO_LOCATION}-docker.pkg.dev/${PROJECT}/${REPO_NAME}/${APP_NAME}"
        IMAGE_TAG = "${version}"
    }

    stages {
        stage('Checkout project') {
            steps {
                git branch: appSourceBranch,
                    credentialsId: githubAccount,
                    url: appSourceRepo
            }
        }

        stage('Build docker image') {
            steps {
                echo 'Build docker image Start'
                sh 'pwd'
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
                withCredentials([file(credentialsId: "credential_gcp", variable: 'GCR_CRED')]) {
                    sh 'cat "${GCR_CRED}" | docker login -u _json_key_base64 --password-stdin https://${REPO_LOCATION}-docker-docker.pkg.dev'
                    sh 'docker push ${IMAGE_NAME}:${IMAGE_TAG}'
                    sh 'docker logout https://${REPO_LOCATION}-docker.pkg.dev'
                }
                sh 'docker rmi ${IMAGE_NAME}:${IMAGE_TAG}'
                echo 'Build docker image Finish'
            }
        }

        stage('Update value in helm-chart') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github_source', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh """#!/bin/bash
                        [[ -d ${helmRepo} ]] && rm -rf ${helmRepo}
                        git clone ${appConfigRepo} --branch ${appConfigBranch}
                        cd ${helmRepo}
                        sed -i 's/^  tag:.*/  tag: "${IMAGE_TAG}"/'
                        git add .
                        git commit -m "Update to version ${IMAGE_TAG}"
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/SotaBox/sotabox_infrastructure.git
                        cd ..
                        [[ -d ${helmRepo} ]] && rm -rf ${helmRepo}
                    """
                }
            }
        }
    }
}
