# Innova IA en Producción: Monitorabilidad y Observabilidad de Sistemas Multi-Agente

Los sistemas multi-agente son poderosos pero complejos. Cuando un sistema con múltiples agentes IA falla, ¿cómo diagnosticas qué pasó? ¿cómo sabes cuál agent causó el problema?

La respuesta: observabilidad de primera clase desde el inicio.

## El Problema de Multi-Agent Debugging

Escenario: Un sistema de recomendaciones con 3 agentes falla en producción. ¿Dónde empezamos?

**Problemas típicos:**
- Logs dispersos entre múltiples agentes
- No hay tracing end-to-end
- Metrics no diferencian entre agentes
- Alerts genéricos ("system down") no útiles

**Resultado:** Mean Time To Recovery (MTTR) de horas en lugar de minutos.

## OpenTelemetry para Multi-Agent Systems

**Instrumentación de cada agent:**

```go
type AgentOrchestrator struct {
    tracer trace.Tracer
    meter  metric.Meter
    logger *zap.Logger
}

func (o *AgentOrchestrator) ExecuteWorkflow(ctx context.Context, input WorkflowInput) (WorkflowOutput, error) {
    ctx, span := o.tracer.Start(ctx, "workflow.execute")
    defer span.End()

    // Agent 1: User Profiling
    profileSpan := o.tracer.Start(ctx, "agent.user_profiling")
    profile, err := o.userProfilingAgent.ProfileUser(input.UserID)
    profileSpan.End()

    // Agent 2: Content Generation
    contentSpan := o.tracer.Start(ctx, "agent.content_generation")
    content, err := o.contentGenerationAgent.Generate(profile)
    contentSpan.End()

    // Agent 3: Quality Assessment
    qualitySpan := o.tracer.Start(ctx, "agent.quality_assessment")
    quality, err := o.qualityAgent.Assess(content)
    qualitySpan.End()

    // Metrics específicos por agent
    o.meter.Record(ctx, 1, metric.WithAttributes(
        attribute.String("agent", "user_profiling"),
        attribute.String("status", "success"),
    ))

    return WorkflowOutput{Content: content, Quality: quality}, nil
}
```

**Tracing Distributed:**

```go
func (o *AgentOrchestrator) CallExternalAgent(ctx context.Context, agentURL string, prompt string) (string, error) {
    ctx, span := o.tracer.Start(ctx, "external_agent.call",
        trace.WithAttributes(
            attribute.String("agent.url", agentURL),
            attribute.String("prompt.length", strconv.Itoa(len(prompt))),
        ),
    )
    defer span.End()

    // HTTP request con tracing context
    req, _ := http.NewRequestWithContext(ctx, "POST", agentURL, strings.NewReader(prompt))
    otel.GetTextMapPropagator().Inject(ctx, propagation.HeaderCarrier(req.Header))

    resp, err := o.httpClient.Do(req)
    if err != nil {
        span.SetStatus(codes.Error, err.Error())
        return "", err
    }

    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)

    span.SetAttributes(attribute.String("response.length", strconv.Itoa(len(body))))
    return string(body), nil
}
```

## Metrics por Agent

**Counter Metrics:**

```go
agentRequests := o.meter.Int64Counter(
    "agent.requests",
    metric.WithDescription("Number of requests per agent"),
)

agentSuccess := o.meter.Int64Counter(
    "agent.requests.success",
    metric.WithDescription("Number of successful requests per agent"),
)

agentErrors := o.meter.Int64Counter(
    "agent.requests.error",
    metric.WithDescription("Number of failed requests per agent"),
)
```

**Histogram Metrics:**

```go
agentLatency := o.meter.Float64Histogram(
    "agent.latency",
    metric.WithDescription("Latency of agent requests"),
    metric.WithUnit("ms"),
)

func (o *AgentOrchestrator) trackAgentLatency(ctx context.Context, agentName string, start time.Time) {
    latency := float64(time.Since(start).Milliseconds())
    o.meter.Record(ctx, latency, metric.WithAttributes(
        attribute.String("agent", agentName),
    ))
}
```

**Gauge Metrics:**

```go
activeAgents := o.meter.Float64Gauge(
    "agent.active",
    metric.WithDescription("Number of active agents"),
)

func (o *AgentOrchestrator) UpdateActiveAgentGauge() {
    o.meter.Record(ctx, float64(len(o.activeAgents)), metric.WithAttributes(
        attribute.String("orchestrator", "production"),
    ))
}
```

## Structured Logging por Agent

```go
type AgentLogger struct {
    logger *zap.Logger
}

func (a *AgentLogger) LogAgentCall(agentName string, input interface{}, output interface{}, duration time.Duration) {
    a.logger.Info("agent.call",
        zap.String("agent", agentName),
        zap.Any("input", input),
        zap.Any("output", output),
        zap.Duration("duration", duration),
        zap.String("status", "success"),
    )
}

func (a *AgentLogger) LogAgentError(agentName string, err error, context map[string]interface{}) {
    a.logger.Error("agent.error",
        zap.String("agent", agentName),
        zap.Error(err),
        zap.Any("context", context),
    )
}
```

## GCP Monitoring Integration

**Cloud Monitoring Metrics:**

```go
import "cloud.google.com/go/monitoring/apiv3"

func (o *AgentOrchestrator) ExportToGCP(ctx context.Context) error {
    client, err := monitoring.NewMetricClient(ctx)
    if err != nil {
        return err
    }

    // Exportar métricas de agentes
    _, err = client.CreateTimeSeries(ctx, &monitoringpb.CreateTimeSeriesRequest{
        Name: fmt.Sprintf("projects/%s", o.projectID),
        TimeSeries: []*monitoringpb.TimeSeries{
            {
                Metric: &monitoringpb.Metric{
                    Type: "custom.googleapis.com/agent/requests",
                    Labels: map[string]string{
                        "agent": "user_profiling",
                    },
                },
                Points: []*monitoringpb.Point{{
                    Interval: &monitoringpb.TimeInterval{
                        EndTime: &timestamppb.Timestamp{Seconds: time.Now().Unix()},
                    },
                    Value: &monitoringpb.TypedValue{
                        Value: &monitoringpb.TypedValue_Int64Value{Int64Value: 100},
                    },
                }},
            },
        },
    })

    return err
}
```

## Alerts Específicos por Agent

```yaml
apiVersion: monitoring.gcp.cloud.google.com/v1
kind: AlertPolicy
metadata:
  name: agent-error-rate-high
spec:
  displayName: "Agent Error Rate High"
  conditions:
  - displayName: "Agent error rate > 5%"
    conditionThreshold:
      filter: 'metric.type="custom.googleapis.com/agent.requests.error" AND resource.type="generic_task"'
      comparison: COMPARISON_GT
      thresholdValue: 0.05
      duration: 300s
```

## Lessons Learned de Producción

**1. Distributed Tracing es Obligatorio**
Sin tracing end-to-end, debugging multi-agent systems es prácticamente imposible.

**2. Metrics por Agent son Critical**
No te sirven metrics agregados. Necesitas metrics específicos por cada agent.

**3. Structured Logging No Opcional**
Logs unstructured son inútiles en sistemas distribuidos. JSON logs con context de agent.

**4. Sampling de Tracing en Producción**
100% sampling en producción es costoso. Implementa sampling inteligente (errores 100%, éxito 1%).

**5. Alerts Deben Ser Actionable**
Alerts genéricos ("system down") no sirven. Alerts específicos por agent y error type.

## Key Takeaways

✅ OpenTelemetry para tracing end-to-end
✅ Metrics específicos por agent (counters, histograms, gauges)
✅ Structured logging con context de agent
✅ GCP Monitoring integration
✅ Alerts específicos y actionable

## Conclusión

Monitorabilidad de sistemas multi-agente requiere observabilidad de primera clase desde el inicio. Con OpenTelemetry, metrics por agent, structured logging, y alerts específicos, puedes diagnosticar y resolver problemas en minutos en lugar de horas.

La clave: observabilidad no es un nice-to-have, es un must-have para producción.

Leer el análisis completo: https://www.ochoajorge.me/es/blog/innova-ia-produccion-monitorabilidad-observabilidad-sistemas-multi-agente

#Observabilidad #OpenTelemetry #GCP #MultiAgent #InnovaIA #DevOps