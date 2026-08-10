# X Thread: Arquitectura Hexagonal + Agentes IA

1/N
La arquitectura hexagonal nos da separación de concerns elegante. Pero cuando integras agentes IA, el patrón se complica: ¿dónde van los MCP servers? ¿cómo manejas las llamadas a LLMs en el dominio?

Thread 🧵

2/N
**Challenge:** ¿Dónde colocas los MCP servers en una arquitectura hexagonal?

❌ Incorrecto: En cada port. Acoplamiento excesivo.

✅ Correcto: Como un *port secundario* que inyecta en el dominio.

3/N
**Arquitectura Hexagonal Extendida:**

```
Domain Layer (Entities, Value Objs, Domain Svc)
      ↑                    ↑                    ↑
Primary Ports        MCP Injection      Secondary Ports
```

MCP Injection como port secundario.

4/N
**MCP Injection Layer:**

```python
class MCPInjectorPort:
    def inject_agent(self, domain_action: str) -> MCPAgent:
        raise NotImplementedError

class MCPInjectorAdapter:
    def inject_agent(self, domain_action: str) -> MCPAgent:
        response = self.mcp_client.call_agent({
            "action": domain_action,
            "context": self._build_context()
        })
        return MCPAgent(response)
```

5/N
**Domain Service con MCP Injection:**

```python
class UserRecommendationService:
    def __init__(self, user_repo, mcp_injector):
        self.user_repo = user_repo
        self.mcp_injector = mcp_injector

    def get_recommendations(self, user_id):
        user = self.user_repo.get(user_id)
        agent = self.mcp_injector.inject_agent("recommend")
        return agent.generate_recommendations(user)
```

6/N
**FastAPI Integration:**

```python
@app.post("/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    user_repo = PostgresUserRepository()
    mcp_injector = OpenAIMCPInjector()
    service = UserRecommendationService(user_repo, mcp_injector)

    recommendations = await service.get_recommendations(user_id)
    return {"recommendations": recommendations}
```

7/N
**pgvector para Embeddings:**

```python
class VectorStoreRepository:
    async def similar_entities(self, embedding, limit=10):
        query = """
            SELECT entity_id, vector <-> :vector as distance
            FROM embeddings ORDER BY distance LIMIT :limit
        """
        return await self.db.execute(query)
```

Semantic search a escala.

8/N
**Lessons Learned de Producción:**

1️⃣ MCP Ports son Stateless por Diseño
Los agentes son stateless. El state está en tu dominio, no en el MCP port.

2️⃣ Observabilidad es Critical
Tracing desde endpoint → domain → MCP → LLM → respuesta.

9/N
3️⃣ Caching de Embeddings es Mandatory
Las APIs de embedding son lentas y costosas. Cachea en pgvector.

4️⃣ Error Boundary en MCP Injection
Los LLMs fallan. Implementa error boundaries en el MCP injection layer.

5️⃣ Testing Strategy Requires Mocks
No puedes testear con LLMs reales. Mock the MCP injector.

10/N
**Before vs After:**

❌ MCP en Cada Port
- Acoplamiento excesivo
- Duplicación de lógica
- Difficult to test

✅ MCP Injection Layer
- Single injection point
- Domain remains pure
- Testable con mocks

11/N
**Key Takeaways:**

✅ MCP como port secundario de inyección
✅ Domain services inyectan agents vía MCP port
✅ FastAPI + pgvector para infrastructure
✅ Observabilidad critical en cada layer
✅ Error boundaries en MCP injection

12/12
🔗 Análisis completo: https://www.ochoajorge.me/es/blog/arquitectura-hexagonal-agentes-ia-patrones-mcp

#ArquitecturaHexagonal #AgentesIA #MCP #FastAPI #pgvector #CleanArchitecture