# X Thread: Hacking Blanco - Defensas en Capas para Sistemas Cloud-First

1/N
Cuando diseñamos arquitecturas cloud-first, la seguridad no puede ser una capa que agregamos al final. Debe estar en el ADN del sistema, desde el primer commit hasta el último deployment.

Thread 🧵

2/N
La mayoría de las brechas cloud provienen de defenderse en lugar de anticipar amenazas.

**Estadísticas preocupantes:**
- 60% de las brechas cloud son por configuración incorrecta
- 45% de las APIs expuestas no tienen autenticación
- 70% de los containers corren con privilegios excesivos

3/N
Aplicando STRIDE a arquitecturas cloud:

**Spoofing:** Identidad comprometida → mTLS, SSO multi-factor

**Tampering:** Config modificada → Immutable infrastructure

**Repudiation:** Logs inseguros → Audit logging immutable

4/N
**Information Disclosure:** Data exposure → Encryption at rest + in transit

**Denial of Service:** Disponibilidad comprometida → Rate limiting, circuit breakers

**Elevation of Privilege:** Escalación horizontal → RBAC min privilege

5/N
**Defensas en 4 Capas con Kubernetes:**

Capa 1: Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
```

Deny-all + whitelist approach.

6/N
Capa 2: Admission Controllers

```go
func validateContainerPrivileged(pod *v1.Pod) error {
    for _, container := range pod.Spec.Containers {
        if container.SecurityContext.Privileged {
            return errors.New("not allowed")
        }
    }
}
```

Bloquea containers privilegiados.

7/N
Capa 3: Secrets Management con Vault

```go
func (v *VaultClient) GetSecret(path string) (*Secret, error) {
    secret, err := v.client.Logical().Read(path)
    return &Secret{
        Data: secret.Data,
        LeaseID: secret.LeaseID,
    }, nil
}
```

Rotación automática de secrets.

8/N
Capa 4: Service Mesh con mTLS

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

Comunicación segura por default.

9/N
**Lessons Learned de Producción:**

1️⃣ RBAC ≠ Seguridad Perimetral
El error más común: usar RBAC como única defensa. Necesitas defense-in-depth.

10/N
2️⃣ Images Multi-Stage + Scanning
No basta con multi-stage builds. Necesitas vulnerability scanning en runtime también.

3️⃣ Chaos Engineering Expone Agujeros
Chaos engineering no es solo para disponibilidad. Expone agujeros de seguridad también.

11/N
4️⃣ Telemetry de Seguridad como First Class
Métricas de seguridad (intentos fallidos, accesos anómalos) deben estar en dashboards principales.

12/N
**Before vs After:**

❌ Security Reactiva
- Corrigiendo vulnerabilidades después de descubiertas
- RBAC única defensa
- Containers con privilegios excesivos

✅ Security Proactiva
- STRIDE desde diseño
- Defensas en 4 capas
- Security telemetry first class

13/13
🔗 Análisis completo: https://ochoajorge.me/es/blog/hacking-blanco-arquitectura-software-defensas-capas-cloud-first

#HackingBlanco #Seguridad #Kubernetes #DevSecOps #CloudArchitecture #STRIDE