# X Thread: Innova IA - Observabilidad de Sistemas Multi-Agente

1/N
Los sistemas multi-agente son poderosos pero complejos. Cuando un sistema con múltiples agentes IA falla, ¿cómo diagnosticas qué pasó? ¿cómo sabes cuál agent causó el problema?

La respuesta: observabilidad de primera clase desde el inicio.

Thread 🧵

2/N
**Problemas típicos de Multi-Agent Debugging:**
- Logs dispersos entre múltiples agentes
- No hay tracing end-to-end
- Metrics no diferencian entre agentes
- Alerts genéricos ("system down") no útiles

Resultado: MTTR de horas en lugar de minutos.

3/N
**OpenTelemetry para Multi-Agent Systems:**

```go
type AgentOrchestrator struct {
    tracer trace.Tracer
    meter  metric.Meter
    logger *zap.Logger
}

func (o *AgentOrchestrator) ExecuteWorkflow(ctx, input) {
    ctx, span := o.tracer.Start(ctx, "workflow.execute")
    defer span.End()

    // Agent 1: User Profiling
    profileSpan := o.tracer.Start(ctx, "agent.user_profiling")
    profile, err := o.userProfilingAgent.Profile(input)
    profileSpan.End()
```

4/N
**Tracing Distributed:**

```go
func (o *AgentOrchestrator) CallExternalAgent(ctx, agentURL, prompt) {
    ctx, span := o.tracer.Start(ctx, "external_agent.call",
        trace.WithAttributes(
            attribute.String("agent.url", agentURL),
        ),
    )
    defer span.End()

    req, _ := http.NewRequestWithContext(ctx, "POST", agentURL, ...)
    otel.GetTextMapPropagator().Inject(ctx, req.Header)
```

5/N
**Metrics por Agent:**

**Counter Metrics:**
- agent.requests (por agent)
- agent.requests.success
- agent.requests.error

**Histogram Metrics:**
- agent.latency (en ms)

**Gauge Metrics:**
- agent.active (número de agentes activos)

6/N
**Structured Logging por Agent:**

```go
func (a *AgentLogger) LogAgentCall(agentName, input, output, duration) {
    a.logger.Info("agent.call",
        zap.String("agent", agentName),
        zap.Any("input", input),
        zap.Any("output", output),
        zap.Duration("duration", duration),
    )
}
```

7/N
**GCP Monitoring Integration:**

```go
import "cloud.google.com/go/monitoring/apiv3"

func (o *AgentOrchestrator) ExportToGCP(ctx) {
    client, _ := monitoring.NewMetricClient(ctx)

    client.CreateTimeSeries(ctx, &monitoringpb.CreateTimeSeriesRequest{
        Name: fmt.Sprintf("projects/%s", o.projectID),
        TimeSeries: []*monitoringpb.TimeSeries{...},
    })
}
```

8/N
**Alerts Específicos por Agent:**

```yaml
apiVersion: monitoring.gcp.cloud.google.com/v1
kind: AlertPolicy
spec:
  displayName: "Agent Error Rate High"
  conditions:
  - displayName: "Agent error rate > 5%"
    conditionThreshold:
      filter: 'metric.type="custom.googleapis.com/agent.requests.error"'
      thresholdValue: 0.05
```

9/N
**Lessons Learned de Producción:**

1️⃣ Distributed Tracing es Obligatorio
Sin tracing end-to-end, debugging multi-agent systems es prácticamente imposible.

2️⃣ Metrics por Agent son Critical
No te sirven metrics agregados. Necesitas metrics específicos por cada agent.

10/N
3️⃣ Structured Logging No Opcional
Logs unstructured son inútiles en sistemas distribuidos. JSON logs con context de agent.

4️⃣ Sampling de Tracing en Producción
100% sampling es costoso. Implementa sampling inteligente (errores 100%, éxito 1%).

5️⃣ Alerts Deben Ser Actionable
Alerts genéricos no sirven. Alerts específicos por agent y error type.

11/N
**Key Takeaways:**

✅ OpenTelemetry para tracing end-to-end
✅ Metrics específicos por agent (counters, histograms, gauges)
✅ Structured logging con context de agent
✅ GCP Monitoring integration
✅ Alerts específicos y actionable

12/12
Monitorabilidad de sistemas multi-agente requiere observabilidad de primera clase desde el inicio.

Con OpenTelemetry, metrics por agent, structured logging, y alerts específicos, puedes diagnosticar y resolver problemas en minutos en lugar de horas.

🔗 Análisis completo: https://www.ochoajorge.me/es/blog/innova-ia-produccion-monitorabilidad-observabilidad-sistemas-multi-agente

#Observabilidad #OpenTelemetry #GCP #MultiAgent #InnovaIA #DevOps