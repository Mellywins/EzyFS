### Usage

Detailed installation instructions for Consul on Kubernetes are found
[here](https://www.consul.io/docs/k8s/installation/overview).

1.  Add the HashiCorp Helm Repository:

        $ helm repo add hashicorp https://helm.releases.hashicorp.com
        "hashicorp" has been added to your repositories

2.  Ensure you have access to the Consul Helm chart and you see the latest chart
    version listed. If you have previously added the HashiCorp Helm repository,
    run `helm repo update`.

         $ helm search repo hashicorp/consul
         NAME                CHART VERSION   APP VERSION DESCRIPTION
         hashicorp/consul    0.35.0          1.10.3      Official HashiCorp Consul Chart

3.  Now you're ready to install Consul! To install Consul with the default
    configuration using Helm 3.2 run the following command below. This will
    create a `consul` Kubernetes namespace if not already present, and install
    Consul on the dedicated namespace.

         $ helm install consul hashicorp/consul --value=k8s/consul/values.yaml --create-namespace -n consul
         NAME: consul

Please see the many options supported in the `values.yaml` file. These are also
fully documented directly on the
[Consul website](https://www.consul.io/docs/platform/k8s/helm.html).

4. This version is made to be ran on a minikube cluster.
