# Arquitectura Hexagonal con Agentes IA: Patrones de Integración Prácticos

La arquitectura hexagonal nos da separación de concerns elegante. Pero cuando integras agentes IA, el patrón se complica: ¿dónde van los MCP servers? ¿cómo manejas las llamadas a LLMs en el dominio?

Este post es para arquitectos y senior engineers que necesitan patrones concretos para integrar agentes IA en sistemas hexagonales.

## El Challenge: MCP en Arquitectura Hexagonal

**Problema:** ¿Dónde colocas los MCP (Model Context Protocol) servers en una arquitectura hexagonal?

**Respuesta incorrecta:** En cada port. Acoplamiento excesivo.

**Respuesta correcta:** Como un *port secundario* que inyecta en el dominio.

## Patrón: MCP Injection Layer

**Arquitectura Hexagonal Extendida:**

```
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Entities    │  │  Value Objs  │  │  Domain Svc  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
           ↑                    ↑                    ↑
    Primary Ports        MCP Injection      Secondary Ports
```

**MCP Injection Layer:**

```python
class MCPInjectorPort:
    """Port para inyectar MCP servers en el dominio"""
    def inject_agent(self, domain_action: str) -> MCPAgent:
        raise NotImplementedError

class MCPInjectorAdapter:
    """Adapter que implementa MCP Injection Port"""
    def __init__(self, mcp_client: MCPClient):
        self.mcp_client = mcp_client

    def inject_agent(self, domain_action: str) -> MCPAgent:
        response = self.mcp_client.call_agent({
            "action": domain_action,
            "context": self._build_context(domain_action)
        })
        return MCPAgent(response)
```

## Implementación con FastAPI + pgvector

**Domain Service con MCP Injection:**

```python
class UserRecommendationService:
    def __init__(self, user_repo: UserRepository, mcp_injector: MCPInjectorPort):
        self.user_repo = user_repo
        self.mcp_injector = mcp_injector

    def get_recommendations(self, user_id: str) -> List[Recommendation]:
        user = self.user_repo.get(user_id)

        # MCP injection para recomendaciones personalizadas
        agent = self.mcp_injector.inject_agent("recommend_products")

        embeddings = self._generate_embeddings(user)
        response = agent.generate_recommendations({
            "user_profile": user.to_dict(),
            "embeddings": embeddings
        })

        return [Recommendation.from_dict(r) for r in response["recommendations"]]
```

**FastAPI Endpoints:**

```python
app = FastAPI()

@app.post("/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    user_repo = PostgresUserRepository()
    mcp_injector = OpenAIMCPInjector()
    service = UserRecommendationService(user_repo, mcp_injector)

    recommendations = await service.get_recommendations(user_id)
    return {"recommendations": [r.to_dict() for r in recommendations]}
```

**pgvector Integration:**

```python
class VectorStoreRepository:
    """Repository para embeddings con pgvector"""
    def __init__(self, db: AsyncSession):
        self.db = db

    async def store_embedding(self, entity_id: str, embedding: List[float]):
        query = text("""
            INSERT INTO embeddings (entity_id, vector)
            VALUES (:entity_id, :vector)
            ON CONFLICT (entity_id) DO UPDATE
            SET vector = :vector
        """)
        await self.db.execute(query, {
            "entity_id": entity_id,
            "vector": str(embedding)
        })

    async def similar_entities(self, embedding: List[float], limit: int = 10):
        query = text("""
            SELECT entity_id, vector <-> :vector as distance
            FROM embeddings
            ORDER BY distance
            LIMIT :limit
        """)
        result = await self.db.execute(query, {
            "vector": str(embedding),
            "limit": limit
        })
        return [row["entity_id"] for row in result.fetchall()]
```

## Lessons Learned de Producción

**1. MCP Ports son Stateless por Diseño**
Los agentes son stateless. El state está en tu dominio, no en el MCP port.

**2. Observabilidad es Critical**
Tracing desde endpoint → domain → MCP → LLM → respuesta. Sin esto, debug es imposible.

**3. Caching de Embeddings es Mandatory**
Las APIs de embedding son lentas y costosas. Cachea embeddings en pgvector.

**4. Error Boundary en MCP Injection**
Los LLMs fallan. Implementa error boundaries en el MCP injection layer, no en cada service.

**5. Testing Strategy Requires Mocks**
No puedes testear con LLMs reales en cada test. Mock the MCP injector.

## Before vs After

**Before: MCP en Cada Port**
- ❌ Acoplamiento excesivo
- ❌ Duplicación de lógica MCP
- ❌ Difficult to test
- ❌ Observabilidad scattered

**After: MCP Injection Layer**
- ✅ Single injection point
- ✅ Domain remains pure
- ✅ Testable con mocks
- ✅ Observabilidad centralizada

## Key Takeaways

✅ MCP como port secundario de inyección
✅ Domain services inyectan agents vía MCP port
✅ FastAPI + pgvector para infrastructure
✅ Observabilidad critical en cada layer
✅ Error boundaries en MCP injection

## Conclusión

Arquitectura hexagonal con agentes IA no requiere romper el patrón. Con MCP injection layer como port secundario, puedes integrar agents mientras mantienes pureza del dominio.

La clave: inyección de MCP, no inyección en cada port.

Leer el análisis completo: https://www.ochoajorge.me/es/blog/arquitectura-hexagonal-agentes-ia-patrones-mcp

#ArquitecturaHexagonal #AgentesIA #MCP #FastAPI #pgvector #CleanArchitecture