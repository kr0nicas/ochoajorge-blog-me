# Hacking Blanco y Arquitectura de Software: Defensas en Capas para Sistemas Cloud-First

Cuando diseñamos arquitecturas cloud-first, la seguridad no puede ser una capa que agregamos al final. Debe estar en el ADN del sistema, desde el primer commit hasta el último deployment.

Este post es para SREs y DevOps Engineers que entienden que la seguridad por diseño no es un lujo, es un requisito para operar sistemas críticos en producción.

## El Problema de la Seguridad Reactiva

La mayoría de los incidentes de seguridad en arquitecturas cloud provienen de defenderse en lugar de anticipar amenazas.

**Estadísticas preocupantes:**
- 60% de las brechas cloud son por configuración incorrecta
- 45% de las APIs expuestas no tienen autenticación
- 70% de los containers corren con privilegios excesivos

## STRIDE Framework en Cloud Architecture

Aplicando STRIDE a arquitecturas cloud:

| Amenaza | Cloud Impact | Defensa |
|---------|--------------|---------|
| Spoofing | Identidad comprometida | mTLS, SSO multi-factor |
| Tampering | Config modificada | Immutable infrastructure |
| Repudiation | Logs inseguros | Audit logging immutable |
| Information Disclosure | Data exposure | Encryption at rest + in transit |
| Denial of Service | Disponibilidad comprometida | Rate limiting, circuit breakers |
| Elevation of Privilege | Escalación horizontal | RBAC min privilege |

## Defensas en Capas con Kubernetes

**Capa 1: Network Policies**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

**Capa 2: Admission Controllers**

```go
func validateContainerPrivileged(pod *v1.Pod) error {
    for _, container := range pod.Spec.Containers {
        if container.SecurityContext != nil &&
           *container.SecurityContext.Privileged {
            return errors.New("privileged containers not allowed")
        }
    }
    return nil
}
```

**Capa 3: Secrets Management con Vault**

```go
func (v *VaultClient) GetSecret(path string) (*Secret, error) {
    secret, err := v.client.Logical().Read(path)
    if err != nil {
        return nil, fmt.Errorf("vault error: %w", err)
    }
    return &Secret{
        Data:      secret.Data,
        LeaseID:   secret.LeaseID,
        Renewable: secret.Renewable,
    }, nil
}
```

**Capa 4: Service Mesh con mTLS**

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

## Lessons Learned de Producción

**1. RBAC ≠ Seguridad Perimetral**
El error más común: usar RBAC como única defensa. Necesitas defense-in-depth.

**2. Images Multi-Stage + Scanning**
No basta con multi-stage builds. Necesitas vulnerability scanning en runtime también.

**3. Chaos Engineering Expone Agujeros**
Chaos engineering no es solo para disponibilidad. Expone agujeros de seguridad también.

**4. Telemetry de Seguridad como First Class**
Métricas de seguridad (intentos fallidos, accesos anómalos) deben estar en dashboards principales.

## Before vs After

**Before: Security Reactiva**
- ❌ Corrigiendo vulnerabilidades después de descubiertas
- ❌ RBAC única defensa
- ❌ Containers con privilegios excesivos
- ❌ Secrets en código o config maps

**After: Security Proactiva**
- ✅ STRIDE desde diseño
- ✅ Defensas en 4 capas
- ✅ Security telemetry first class
- ✅ Chaos engineering para seguridad

## Key Takeaways

✅ Seguridad por diseño, no por accidente
✅ STRIDE framework aplicado a cloud
✅ Defensas en 4 capas: Network → Admission → Secrets → Service Mesh
✅ Telemetry de seguridad first class
✅ Chaos engineering expone agujeros de seguridad

## Conclusión

La seguridad en arquitecturas cloud-first no puede ser una capa que agregamos al final. Debe estar en el ADN del sistema.

Con STRIDE, defensas en capas, y telemetry de seguridad first class, puedes construir sistemas cloud que sean resistentes a amenazas modernas.

La clave: anticipar amenazas, no solo defenderse de ellas.

Leer el análisis completo: https://ochoajorge.me/es/blog/hacking-blanco-arquitectura-software-defensas-capas-cloud-first

#HackingBlanco #Seguridad #Kubernetes #DevSecOps #CloudArchitecture #STRIDE