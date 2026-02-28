---
description: Proceso estandarizado para corregir bugs siguiendo mejores prácticas de debugging y testing.
---

# Bug Fix Workflow

Este workflow es obligatorio para todas las correcciones de bugs en el ERP.

## 1. Reproducción y Diagnóstico

### 1.1 Reproducir el Bug
- Crear un caso de prueba mínimo que reproduzca el bug
- Documentar pasos exactos para reproducir
- Capturar logs, screenshots, o errores relevantes

### 1.2 Identificar Root Cause
- Usar debugging tools (pdb para Python, delve para Go)
- Revisar logs de aplicación
- Verificar assumptions sobre el estado del sistema
- Identificar la capa afectada (Repository, Service, Handler)

## 2. Implementación del Fix

### 2.1 Crear Branch
```bash
git checkout -b fix/descripcion-corta-del-bug
```

### 2.2 Aplicar Fix Siguiendo DDD
**Repository Layer:**
- Solo si el bug está en queries SQL/GORM
- Verificar que no rompa otras queries

**Service Layer:**
- Mayoría de bugs de lógica de negocio
- Agregar validaciones faltantes
- Corregir cálculos incorrectos

**Handler Layer:**
- Bugs de validación de input
- Errores de serialización/deserialización
- Headers faltantes (ej. X-Tenant-ID)

### 2.3 Escribir Test que Falle Primero
```python
# Python example
def test_bug_fix_for_issue_123():
    """Test that reproduces bug #123 before fix."""
    # Arrange
    partner = create_partner(credit_limit=1000)
    
    # Act
    result = calculate_available_credit(partner, used=500)
    
    # Assert
    assert result == 500  # This should fail before fix
```

```go
// Go example
func TestBugFix_Issue123(t *testing.T) {
    // Arrange
    item := &InventoryItem{StockQuantity: 10}
    
    // Act
    err := item.Reserve(15)
    
    // Assert
    assert.Error(t, err) // Should fail before fix
}
```

### 2.4 Aplicar Fix
- Hacer el cambio mínimo necesario
- Seguir principio KISS (Keep It Simple, Stupid)
- No refactorizar código no relacionado

### 2.5 Verificar que Test Pasa
```bash
# Python
pytest path/to/test_file.py::test_bug_fix_for_issue_123

# Go
go test ./path/to/package -run TestBugFix_Issue123
```

## 3. Verificación Completa

### 3.1 Run All Tests
```bash
# Python
pytest

# Go
go test ./...

# Frontend
npm test
```

### 3.2 Verificación Manual
- Reproducir el bug original → debe estar corregido
- Verificar casos edge relacionados
- Verificar que no se rompió funcionalidad existente

### 3.3 Verificar Linting
```bash
# Python
ruff check .
mypy .

# Go
golangci-lint run

# TypeScript
npm run lint
```

## 4. Documentación

### 4.1 Actualizar Common Pitfalls (si aplica)
Si el bug es un patrón común, agregarlo a `.cursor/rules/common_pitfalls.md`

### 4.2 Commit Message
Usar Conventional Commits:
```bash
git commit -m "fix(module): descripción corta del fix

- Detalle del problema
- Detalle de la solución
- Casos edge considerados

Fixes #123"
```

### 4.3 Actualizar Walkthrough
Agregar entrada en `walkthrough.md` si es un bug significativo:
```markdown
## Bug Fix: [Descripción]

**Issue:** #123  
**Root Cause:** [Explicación]  
**Solution:** [Qué se cambió]  
**Testing:** [Cómo se verificó]
```

## 5. Code Review

### 5.1 Crear Pull Request
- Título claro: "Fix: [descripción]"
- Descripción con:
  - Problema original
  - Root cause
  - Solución implementada
  - Tests agregados
  - Screenshots (si aplica)

### 5.2 Self-Review Checklist
- [ ] Test que reproduce el bug agregado
- [ ] Fix aplicado en la capa correcta (Repository/Service/Handler)
- [ ] Todos los tests pasan
- [ ] Linting pasa
- [ ] No hay cambios no relacionados
- [ ] Commit message sigue Conventional Commits
- [ ] Documentación actualizada (si aplica)

## 6. Deployment

### 6.1 Merge
```bash
git checkout main
git merge fix/descripcion-corta-del-bug
git push origin main
```

### 6.2 Verificar en Staging/Production
- Reproducir el bug original → debe estar corregido
- Monitorear logs por 24 horas
- Verificar métricas de error rate

## Common Bug Patterns

### Pattern 1: Infinite Loops en React Hooks
**Síntoma:** Llamadas API infinitas  
**Root Cause:** Dependencias incorrectas en useCallback/useEffect  
**Fix:** Remover estado interno de dependencias

### Pattern 2: Multi-Tenant Filtering
**Síntoma:** Datos de otros tenants visibles  
**Root Cause:** Usar JWT company_id en lugar de X-Tenant-ID header  
**Fix:** Usar X-Tenant-ID header como source of truth

### Pattern 3: Race Conditions en Stock Updates
**Síntoma:** Stock negativo o inconsistente  
**Root Cause:** No usar transacciones  
**Fix:** Usar database transactions con row locking

## Escalation

Si el bug es:
- **Crítico** (afecta producción): Notificar inmediatamente, fix en < 4 horas
- **Alto** (afecta funcionalidad core): Fix en < 24 horas
- **Medio** (afecta UX): Fix en < 1 semana
- **Bajo** (cosmético): Fix en próximo sprint

---

**Referencias:**
- Common Pitfalls: `.cursor/rules/common_pitfalls.md`
- Testing Standard: `.cursor/rules/testing_standard.md`
- Git Workflow: `.cursor/rules/git_workflow.md`
